module.exports = {
  apps: [
    {
      name: 'mlbots-node',
      script: './app.js',
      instances: 2,
      exec_mode: 'fork',
      env: {
        NODE_ENV: process.env.ENV,
        NODE_PORT: 3000,
        PORT: 3000,
      },
    },
    {
      name: 'mlbots-http',
      script: './app_http.js',
      env: {
        NODE_ENV: process.env.ENV,
        PORT: 3001,
      },
    },
  ],
};
