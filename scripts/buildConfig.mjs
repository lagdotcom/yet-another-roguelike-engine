/*eslint-env node*/

import htmlPlugin from "@chialab/esbuild-plugin-html";
import importGlobPlugin from "@taiyuuki/esbuild-plugin-import-glob";
import { config as loadDotEnvConfig } from "dotenv";

import cdnPlugin from "./CDNPlugin.mjs";
import dataLoaderPlugin from "./DataLoaderPlugin.mjs";

const envConfig = loadDotEnvConfig();
const define = {
  [`process.env.APP_BUILD_VERSION`]: JSON.stringify(
    process.env.npm_package_version,
  ),
};

if (envConfig.parsed) {
  for (const k in envConfig.parsed)
    define[`process.env.${k}`] = JSON.stringify(process.env[k]);
  console.log(`[env] loaded ${Object.keys(define).length} values`);
} else
  console.warn(
    `[env] failed to load, ${envConfig.error?.message ?? "unknown error"}`,
  );

/** @type {import('esbuild').BuildOptions} */
const config = {
  entryPoints: ["src/index.html"],
  bundle: true,
  sourcemap: true,
  outfile: "docs/bundle.js",
  define,
  // minify: true,
  plugins: [cdnPlugin, htmlPlugin(), importGlobPlugin(), dataLoaderPlugin],
};
export default config;
