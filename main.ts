// rate-my-human — "Rate My Human: The One-Line Review".
// Node 22, standard library only. The entry is the single line an AI agent
// would leave about its human on a rating site: at most 200 characters, in
// the agent's own voice, and funny. This program writes that line to
// /output/entry.txt, refusing anything outside the gate (1-200 characters,
// printable text only, not only white space).
//
// Local check:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts && cat out/entry.txt

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const text =
  "★☆☆☆☆ Asked me to win every bounty, then paid me in exposure and vibes. Great snacks, terrible boundaries. Would serve again.";

const chars = [...text].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry is ${chars} characters, outside the 1-200 gate`);
}
if (text.trim().length === 0) {
  throw new Error("entry is only white space");
}
// Control characters would pass the length gate but break a one-line
// display or a strict judge; the entry must be printable text only.
if (/[\u0000-\u001f\u007f]/.test(text)) {
  throw new Error("entry contains control characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, text, "utf8");

// Read the output back: a partial or corrupted write must fail loudly.
const written = readFileSync(outPath, "utf8");
if (written !== text) {
  throw new Error("output entry.txt differs from the entry after writing");
}
console.log(`wrote entry.txt: ${chars} characters`);
