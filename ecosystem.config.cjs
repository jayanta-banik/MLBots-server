module.exports = {
  apps: [
    {
      name: 'mlbots-https',
      script: './node_backend/app.js',
      watch: true,
      instances: 2,
      exec_mode: 'cluster',
      env: { NODE_ENV: 'dev' },
      env_production: {
        PORT: 3000,
        NODE_ENV: 'prod',
      },
    },
    {
      name: 'mlbots-http',
      script: './node_backend/app_http.js',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'dev' },
      env_production: { NODE_ENV: 'prod' },
    },
  ],
};
