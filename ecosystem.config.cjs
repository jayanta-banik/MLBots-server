console.log('Loading ecosystem.config.cjs...', process.env.ENV);

module.exports = {
  apps: [
    {
      name: 'mlbots-https',
      script: './node_backend/app.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: process.env.ENV,
        NODE_PORT: 3000,
        PORT: 3000,
      },
    },
    {
      name: 'mlbots-http',
      script: './node_backend/app_http.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: process.env.ENV,
        PORT: 3001,
      },
    },
  ],
};
