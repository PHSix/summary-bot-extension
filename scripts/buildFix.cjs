const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const cwd = process.cwd();
const manifest = path.resolve(cwd, "dist", "manifest.json");

try {
  const content = JSON.parse(readFileSync(manifest).toString());

  content.background.service_worker = "background.js";
  writeFileSync(manifest, JSON.stringify(content));
} catch {}
