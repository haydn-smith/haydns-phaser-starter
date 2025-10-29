import esbuildServe from "esbuild-serve";
import inlineImage from "esbuild-plugin-inline-image";
import { configDotenv } from "dotenv";
import { execSync } from "child_process";

// Load environment config from .env file.
configDotenv({
  quiet: true,
});
const define = {};
for (const k in process.env) {
  if (k.indexOf('PHASER_') === 0) {
    define[`process.env.${k}`] = JSON.stringify(process.env[k]);
  }
}

// Git commit.
let sha = '[no version]';
try {
  sha = execSync('git rev-parse HEAD').toString().trim();
} catch {}
define[`process.env.GIT_SHA`] = JSON.stringify(sha);

esbuildServe(
  {
    logLevel: "info",
    entryPoints: ["src/main.ts"],
    bundle: true,
    sourcemap: true,
    outfile: "public/bundle.min.js",
    plugins: [inlineImage()],
    define,
  },
  { root: "public", port: 8080 },
);
