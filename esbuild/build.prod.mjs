import { build } from "esbuild";
import clean from "esbuild-plugin-clean";
import copy from "esbuild-plugin-copy";
import inlineImage from "esbuild-plugin-inline-image";
import { configDotenv } from "dotenv";

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

const builder = async () => {
  await build({
    entryPoints: ["./src/main.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ["chrome58", "firefox57", "safari11", "edge18"],
    outfile: "./dist/bundle.min.js",
    define,
    plugins: [
      clean({
        patterns: ["./dist/*", "./public/bundle.min.js"],
      }),
      inlineImage({
        namespace: "assets",
      }),
      copy({
        assets: [
          { from: "./public/index.html", to: "./" },
          { from: "./public/style.css", to: "./" },
          { from: "./public/favicon.ico", to: "./" },
          { from: "./public/favicon.png", to: "./" },
          { from: "./public/assets/**/*", to: "./assets/" },
        ],
      }),
    ],
  });
};

builder();
