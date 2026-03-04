import { execSync } from "child_process";
import { unlinkSync, existsSync } from "fs";
import { join } from "path";

const root = join(import.meta.dirname, "..");
const lockfile = join(root, "package-lock.json");

if (existsSync(lockfile)) {
  console.log("Deleting old package-lock.json...");
  unlinkSync(lockfile);
}

console.log("Regenerating package-lock.json from package.json...");
execSync("npm install --package-lock-only", { cwd: root, stdio: "inherit" });
console.log("Done! Lockfile regenerated.");
