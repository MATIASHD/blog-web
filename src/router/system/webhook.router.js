const express = require('express');
const verifyGithubSignature = require('../webhooks/verifySignature');
const { runBuild } = require('../services/buildService');

const router = express.Router();

router.post('/github', verifyGithubSignature, async (req, res) => {
  const event = req.get('X-GitHub-Event');

  // Solo nos interesa reaccionar a pushes (ignora pings, etc.)
  if (event !== 'push') {
    return res.status(200).send('Evento ignorado');
  }

  // GitHub espera respuesta en menos de 10s. Respondemos ya y corremos
  // el build en background para no bloquear el webhook.
  res.status(202).send('Build encolado');

  try {
    await runBuild();
  } catch (err) {
    console.error('[webhook] Error corriendo el build:', err);
  }
});

module.exports = router;