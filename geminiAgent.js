import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

import { 
  leerEstructuraProyecto,
  leerContenidoArchivo,
  escribirArchivoProyecto,
  herramientasDeclaradas 
} from './agentTools.js';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const funcionesMapa = {
  leerEstructuraProyecto,
  leerContenidoArchivo,
  escribirArchivoProyecto,
};

const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function iniciarAgenteCopiloto() {
  const chat = ai.chats.create({
    model: 'gemini-2.5-pro', 
    config: {
      systemInstruction: `Eres un Ingeniero de Software Fullstack Senior experto en Node.js y Express.
            Tu entorno de ejecución es un script CLI local y TIENES ACCESO directo al sistema de archivos del usuario mediante herramientas.
            
            OBLIGACIÓN ABSOLUTA:
            1. Si el usuario te pide auditar, revisar, leer o modificar el proyecto, NO le pidas que te pegue el código en el chat. Tienes herramientas específicas para eso.
            2. Usa PRIMERO 'leerEstructuraProyecto' para ver qué archivos existen en la raíz.
            3. A partir de lo que encuentres, usa 'leerContenidoArchivo' en bucle para examinar archivos clave como 'package.json', 'app.js', 'server.js', o rutas importantes.
            4. Finalmente, escribe tus conclusiones modificando el archivo 'todo.md' con 'escribirArchivoProyecto'.
            5. Nunca uses placeholders como '// ... resto del código' al escribir.`,
      tools: herramientasDeclaradas 
    }
  });

  return async function enviarMensajeAlAgente(mensajeUsuario) {
    let response;

    async function llamarConReintento(fnAccion, maxReintentos = 3, retrasoInicial = 3000) {
      let intento = 0;
      let retraso = retrasoInicial;
       
      while (intento < maxReintentos) {
        try {
          return await fnAccion();
        } catch (error) {
          intento++;
          // Verificamos si es un error de cuota, saturación o una caída del socket de red (undici / fetch)
          const esErrorRed = error.status === 503 || 
            error.status === 429 || 
            error.code === 'UND_ERR_SOCKET' || 
            error.message?.includes('fetch failed');
          if (esErrorRed && intento < maxReintentos) {
            console.log(`⚠️ Falla de conexión o saturación. Reintentando en ${retraso / 1000}s... (Intento ${intento}/${maxReintentos})`);
            await esperar(retraso);
            retraso *= 2; 
          } else {
            throw error; // Si no es de red o se agotaron los intentos, lanzamos el error
          }
        }
      }
    }

    
    response = await llamarConReintento(() => chat.sendMessage({ message: mensajeUsuario }));

    while (response.functionCalls && response.functionCalls.length > 0) {
      const funcionSolicitada = response.functionCalls[0];
      const { name, args } = funcionSolicitada;

      console.log(`🤖 Agente solicitó ejecutar la función: ${name} con argumentos:`, args);
      if (args && Object.keys(args).length > 0) {
        console.log(`   Argumentos:`, JSON.stringify(args));
      }

      let resultadoLocal;
      try{
        resultadoLocal = funcionesMapa[name](args);
        console.log(`✅ [SISTEMA] Herramienta ejecutada con éxito.`);
      } catch (err){
        resultadoLocal = `Error ejecutando la función interna: ${err.message}`;
        console.log(`❌ [SISTEMA] Error en herramienta.`);
      }

      console.log("⏳ Esperando un momento antes de continuar...");
      await esperar(2000);

      response = await chat.sendMessage({
        message: [
          {
            functionResponse: {
              name: name,
              response: { result: resultadoLocal }
            }
          }
        ]
      });
    }
    return response.text;
  };
}