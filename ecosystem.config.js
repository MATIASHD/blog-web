module.exports = {
  apps: [{
    name: 'arevdev',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '300M',
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    log_file: 'logs/pm2-combined.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_restarts: 10,
    restart_delay: 4000,
    kill_timeout: 5000,
    shutdown_with_message: true,
  }],
};
