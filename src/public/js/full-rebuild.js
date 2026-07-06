/**
 * Fuerza la reconstrucción completa sin esperar un webhook.
 * Útil para la sincronización inicial, o para correr desde un cron
 * cada tanto como red de seguridad (por si un webhook se perdiera).
 *
 * Uso: npm run rebuild
 */

require('dotenv').config();
const { runBuild } = require('../src/services/buildService');

runBuild()
  .then(() => {
    console.log('Rebuild manual completado.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error en el rebuild manual:', err);
    process.exit(1);
  });