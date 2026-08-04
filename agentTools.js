import fs from 'fs';
import path from 'path';

export function leerEstructuraProyecto(){
  const rootDir = process.cwd();
  return fs.readdirSync(rootDir)
    .filter(item => item !== 'node_module' && !item.startsWith('.'));
}

export function leerContenidoArchivo({ rutaRelativa }) {
  try {
    const rutaAbsoluta = path.join(process.cwd(), rutaRelativa);
    return fs.readFileSync(rutaAbsoluta, 'utf-8');
  } catch (error) {
    return `Error al leer el archivo: ${error.message}`;
  }
}

export const herramientasDeclaradas = [
  {
    functionDeclaration: {
      name: 'leerEstructuraProyecto',
      description: 'Obtiene la lista de archivos y carpetas principales de la raíz del proyecto Express.'
    }
  },
  {
    functionDeclaration: {
      name: 'leerContenidoArchivo',
      description: 'Lee el código fuente de un archivo específico pasando su ruta relativa.',
      parameters: {
        type: 'OBJECT',
        properties: {
          rutaRelativa: {
            type: 'STRING',
            description: 'La ruta relativa del archivo a leer (ej. "src/routes/blog.js").'
          }
        },
        required: ['rutaRelativa']
      }
    }},
  {
    functionDeclaration: {
      name: 'leerEstructuraProyecto',
      description: 'Obtiene la lista de archivos y carpetas principales de la raíz del proyecto Express.'
    }
  },
  {
    functionDeclaration: {
      name: 'leerContenidoArchivo',
      description: 'Lee el código fuente de un archivo específico pasando su ruta relativa.',
      parameters: {
        type: 'OBJECT',
        properties: {
          rutaRelativa: {
            type: 'STRING',
            description: 'La ruta relativa del archivo a leer (ej. "src/routes/blog.js").'
          }
        },
        required: ['rutaRelativa']
      }
    }
  },
  {
    functionDeclaration: {
      name: 'escribirArchivoProyecto',
      description: 'Escribe o crea un archivo de código en el proyecto. Sobrescribe el contenido anterior por completo.',
      parameters: {
        type: 'OBJECT',
        properties: {
          path: { // Cambiado a 'path' que es más intuitivo para el modelo
            type: 'STRING',
            description: 'La ruta relativa del archivo (ej. "TODO.md" o "src/app.js").'
          },
          contenido: {
            type: 'STRING',
            description: 'El código o texto completo del archivo.'
          }
        },
        required: ['path', 'contenido']
      }
    }
  }
];

// En agentTools.js modifica la función para que sea tolerante a fallos de argumentos
export function escribirArchivoProyecto(args) {
  try {
    // Tolerancia: si Gemini envía 'path' o 'rutaRelativa', capturamos cualquiera
    const rutaRelativa = args.rutaRelativa || args.path || args.filename;
    const contenido = args.contenido;
    if (!rutaRelativa || !contenido) {
      return "Error: Faltan los parámetros requeridos 'rutaRelativa' o 'contenido'.";
    }
    const rutaAbsoluta = path.join(process.cwd(), rutaRelativa);
    const carpetaContenedora = path.dirname(rutaAbsoluta);
      
    if (!fs.existsSync(carpetaContenedora)) {
      fs.mkdirSync(carpetaContenedora, { recursive: true });
    }

    fs.writeFileSync(rutaAbsoluta, contenido, 'utf-8');
    return `Éxito: El archivo en '${rutaRelativa}' ha sido escrito correctamente.`;
  } catch (error) {
    return `Error al escribir el archivo: ${error.message}`;
  }
}

