// main.ts — Ostran passport spread (with a very light guilloche background,
// like a banknote's, across both pages of the spread).
// Copies the generated entry.png (shipped beside this file) to the output
// directory, byte for byte. Node 22, stdlib only, no network, deterministic.
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const MAX_BYTES = 1048576;

if (!existsSync(source)) {
  throw new Error("entry.png not found beside main.ts");
}
if (statSync(source).size === 0) {
  throw new Error("entry.png is empty");
}

mkdirSync(outDir, { recursive: true });
const dest = join(outDir, "entry.png");
copyFileSync(source, dest);
if (statSync(dest).size === 0) {
  throw new Error("entry.png was copied but is empty");
}
if (statSync(dest).size > MAX_BYTES) {
  throw new Error("entry.png exceeds the 1 MiB gate");
}
if (statSync(dest).size !== statSync(source).size) {
  throw new Error("entry.png was copied incompletely");
}
