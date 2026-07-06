#!/usr/bin/env node
require('dotenv').config({ override: true });
const { build } = require('./src/services/build.service');

try {
  build();
  process.exit(0);
} catch (err) {
  console.error('Build failed:', err.message);
  process.exit(1);
}
