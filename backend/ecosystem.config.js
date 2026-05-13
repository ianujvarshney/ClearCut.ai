module.exports = {
  apps: [
    {
      name: "clearcut-api",
      script: "dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "clearcut-image-worker",
      script: "dist/src/workers/image.worker.js",
      instances: 2,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "clearcut-media-worker",
      script: "dist/src/workers/media.worker.js",
      instances: 2,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
