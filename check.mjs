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
  const url = new URL(path, 'https://example.test/');
  await access(resolve("dist", url.pathname === '/' ? 'index.html' : url.pathname.slice(1)));
  if (url.pathname === '/' && url.hash) assert(ids.includes(url.hash.slice(1)), `Missing anchor: ${url.hash}`);
}
for (const path of [
  "vendor/three.module.min.js",
  "vendor/three.core.min.js",
  "vendor/anime.esm.min.js",
  "vendor/gsap.min.js",
  "vendor/ScrollTrigger.min.js",
]) {
  await access(resolve("dist", path));
}
assert.equal(
  [...html.matchAll(/data-chapter=/g)].length,
  12,
  "All 12 story chapters must be present",
);
const worlds = [...html.matchAll(/data-world="([^"]+)"/g)].map((match) => match[1]);
for (const world of ["orbit", "laptop", "network", "portal"]) {
  assert.equal(worlds.filter((value) => value === world).length, 1,
    `${world} must belong to exactly one chapter, never repeat across the story`);
}
assert(
  html.includes("/programs.html"),
  "Join must lead to the program platform",
);
execFileSync(process.execPath, ["--check", "dist/app.js"]);
execFileSync(process.execPath, ["--check", "server.mjs"]);
console.log(
  "PASS: 12 chapters, unique IDs, all navigation targets, local assets, real join destination, and JavaScript syntax.",
);
