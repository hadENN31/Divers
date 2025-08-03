module.exports = {
  apps: [
    {
      name: "myapp",
      script: "./www/app.js",
      instances: 3,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
