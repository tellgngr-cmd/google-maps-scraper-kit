// Renders every ad in variants.json to out/<id>.mp4.
// Usage: node render-variants.mjs [variants.json] [--only=id1,id2]
// Set REMOTION_BROWSER to a Chrome/Chromium path if Remotion can't download its own.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--")) ?? "variants.json";
const only = args.find((a) => a.startsWith("--only="))?.slice(7).split(",");
const variants = JSON.parse(readFileSync(file, "utf8")).filter((v) => !only || only.includes(v.id));

mkdirSync("out/props", { recursive: true });
for (const v of variants) {
  const propsFile = `out/props/${v.id}.json`;
  writeFileSync(propsFile, JSON.stringify(v));
  const cmd = ["remotion", "render", "src/index.ts", "AdVideo", `out/${v.id}.mp4`, `--props=${propsFile}`];
  if (process.env.REMOTION_BROWSER) cmd.push(`--browser-executable=${process.env.REMOTION_BROWSER}`);
  console.log(`Rendering ${v.id} (${v.format}, ${v.durationSec}s)...`);
  execFileSync("npx", cmd, { stdio: "inherit" });
}
console.log(`Done: ${variants.length} video(s) in out/`);
