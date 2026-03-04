import { execSync } from "child_process";

console.log("Removing old lockfile...");
try {
  execSync("rm -f /vercel/share/v0-project/package-lock.json", { stdio: "inherit" });
} catch (e) {
  console.log("No lockfile to remove");
}

console.log("Running npm install to regenerate lockfile...");
execSync("cd /vercel/share/v0-project && npm install --ignore-scripts", {
  stdio: "inherit",
  env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
});

console.log("Done! Lockfile regenerated.");
