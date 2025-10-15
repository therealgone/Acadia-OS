const {execSync} = require("child_process");

const branch = process.env.VERCEL_GET_COMMIT_REF;
if (branch === "master") {
  console.log("Master branch detected: running production build...");
  // Run your normal Next.js build
  execSync("npm run vercel-build", { stdio: "inherit" });
} else {
  console.log(`Branch "${branch}" detected: skipping automatic build.`);
  // Exit without error, so Vercel skips the build
  process.exit(0);
}