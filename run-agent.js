import { iniciarAgenteCopiloto } from './geminiAgent.js';

async function ejecutar() {
  // Capturar el argumento de la terminal (ej: node run-agent.js "mi instrucción")
  const argumentoUsuario = process.argv[2];

  if (!argumentoUsuario) {
    console.error("❌ Por favor, proporciona una instrucción para el agente.");
    console.log('Ejemplo: node run-agent.js "Audita mi proyecto..."');
    process.exit(1);
  }

  console.log("🤖 Inicializando Agente Copiloto Fullstack...");
  const enviarMensajeAlAgente = await iniciarAgenteCopiloto();

  console.log("\n💬 Enviando instrucción al agente...");
  console.log(`> "${argumentoUsuario}"\n`);

  try {
    const respuestaFinal = await enviarMensajeAlAgente(argumentoUsuario);
        
    console.log("--------------------------------------------------");
    console.log("📝 RESPUESTA DEL AGENTE:");
    console.log("--------------------------------------------------");
    console.log(respuestaFinal);
    console.log("--------------------------------------------------");
        
  } catch (error) {
    console.error("❌ Ocurrió un error durante la ejecución del agente:", error);
  }
}

ejecutar();