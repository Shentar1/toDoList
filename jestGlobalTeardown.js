// jestGlobalTeardown.js
const kill = require("tree-kill");

module.exports = async () => {
  console.log("\n🛑 Shutting down API server and all child processes...");

  if (globalThis.__API_SERVER__ && globalThis.__API_SERVER__.pid) {
    await new Promise((resolve) => {
      // Kill the process ID (pid) and all subprocesses spawned by "npm run dev"
      kill(globalThis.__API_SERVER__.pid, "SIGKILL", (err) => {
        if (err) {
          console.error("⚠️ Error shutting down server process tree:", err);
        } else {
          console.log("✅ API server completely terminated.");
        }
        resolve();
      });
    });
  }
};
