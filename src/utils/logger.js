const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(process.cwd(), 'logs');
const MAX_LOG_SIZE = 5 * 1024 * 1024;

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function getLogFilePath(type) {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(LOG_DIR, `${type}-${date}.log`);
}

function rotateIfNeeded(filePath) {
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > MAX_LOG_SIZE) {
      const rotated = filePath + '.1';
      if (fs.existsSync(rotated)) fs.unlinkSync(rotated);
      fs.renameSync(filePath, rotated);
    }
  } catch (e) {
  }
}

function writeLog(type, message, data = null) {
  const timestamp = new Date().toISOString();
  let logLine = `${timestamp} [${type}] ${message}`;
  if (data) {
    logLine += ` | ${typeof data === 'object' ? JSON.stringify(data, Object.getOwnPropertyNames(data)) : data}`;
  }
  console.log(logLine);
  try {
    const filePath = getLogFilePath(type.toLowerCase());
    rotateIfNeeded(filePath);
    fs.appendFileSync(filePath, logLine + '\n');
  } catch (e) {
  }
}

class Logger {
  static info(message, data = null) {
    writeLog('INFO', message, data);
  }

  static error(message, error = null) {
    const data = error
      ? { message: error.message, stack: error.stack?.split('\n').slice(0, 4).join(' | ') }
      : null;
    writeLog('ERROR', message, data);
  }

  static warn(message, data = null) {
    writeLog('WARN', message, data);
  }

  static debug(message, data = null) {
    if (process.env.DEBUG) {
      writeLog('DEBUG', message, data);
    }
  }
}

module.exports = Logger;
