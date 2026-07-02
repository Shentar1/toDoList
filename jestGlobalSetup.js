const { spawn } = require("child_process");

module.exports = async () => {
  console.log("\n🚀 Starting API server for Jest...");

  // Start your API server (adjust 'npm run start' to your actual server start command)
  const server = spawn("npm", ["run", "dev"], {
    shell: true,
    env: { ...process.env, NODE_ENV: "test" },
  });

  // Attach the process reference to the global object so teardown can access it
  globalThis.__API_SERVER__ = server;

  // Wait for the server to be ready before letting Jest run tests
  await new Promise((resolve, reject) => {
    server.stdout.on("data", (data) => {
      console.log(data.toString());
      if (data.toString().includes("Ready in")) {
        // Match your server's startup log
        console.log("✅ API server is ready!");
        resolve();
      }
    });

    server.stderr.on("data", (data) => {
      console.error(`Server Error: ${data}`);
    });

    server.on("error", reject);
  });
};
