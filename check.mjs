import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

// A small release check for broken navigation and missing runtime assets.
const html = await readFile("dist/index.html", "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "HTML IDs must be unique");
for (const [, hash] of html.matchAll(/href="#([^"]+)"/g)) {
  assert(ids.includes(hash), `Navigation target is missing: ${hash}`);
}
for (const [, path] of html.matchAll(/(?:src|href)="((?!https?:|#)[^"]+)"/g)) {
  await access(resolve("dist", path));
}
for (const path of [
  "vendor/three.module.min.js",
  "vendor/three.core.min.js",
  "vendor/anime.esm.min.js",
]) {
  await access(resolve("dist", path));
}
assert.equal(
  [...html.matchAll(/data-chapter=/g)].length,
  14,
  "All 14 story chapters must be present",
);
assert(
  html.includes("https://cre8techin.in/programs/"),
  "Join must lead to the real programs page",
);
execFileSync(process.execPath, ["--check", "dist/app.js"]);
execFileSync(process.execPath, ["--check", "server.mjs"]);
console.log(
  "PASS: 14 chapters, unique IDs, all navigation targets, local assets, real join destination, and JavaScript syntax.",
);
