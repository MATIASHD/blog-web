const express = require('express');
const crypto = require('crypto');
const { spawn } = require('child_process');
const path = require('path');
const router = express.Router();

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || '';

function verifySignature(req) {
  if (!WEBHOOK_SECRET) return true;
  const sig = req.headers['x-hub-signature-256'];
  if (!sig || !req.rawBody) return false;
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(sig));
  } catch {
    return false;
  }
}

router.post('/github', (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.headers['x-github-event'];
  if (event !== 'push') {
    return res.status(200).json({ message: 'Ignored event: ' + event });
  }

  const buildScript = path.join(process.cwd(), 'build.js');
  const child = spawn('node', [buildScript], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
    env: { ...process.env },
  });

  let output = '';
  child.stdout.on('data', d => output += d.toString());
  child.stderr.on('data', d => output += d.toString());
  child.on('close', code => {
    console.log(`Webhook build exited with code ${code}`);
    if (code !== 0) console.error('Build output:', output);
  });
  child.unref();

  res.json({ success: true, message: 'Build triggered' });
});

module.exports = router;
