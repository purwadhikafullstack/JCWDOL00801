module.exports = {
  apps: [
    {
      name: "JCWDOL00801", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8801,
      },
      time: true,
    },
  ],
};
