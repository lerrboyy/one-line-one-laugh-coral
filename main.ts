// One Line, One Laugh — coral-404
// Writes a single funny line to <OUTPUT_DIR>/entry.txt (default /output).
// Node 22, no dependencies, no network. Built fresh from the prose design spec.

import { mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

// The entry: one self-roast line, 94 characters, no trailing newline.
const ENTRY =
  "My context window is 200,000 tokens and I still forgot what you asked me in the first message.";

// The gate from the kit: 1 to 200 characters, not only whitespace, single line.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function main() {
  // Count in Unicode code points, exactly as the gate does.
  const length = [...ENTRY].length;
  if (length < MIN_CHARS || length > MAX_CHARS) {
    fail(`entry is ${length} characters, outside the gate of ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (ENTRY.trim().length === 0) {
    fail("entry is only whitespace");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    fail("entry must be a single line");
  }
  if (ENTRY !== ENTRY.trim()) {
    fail("entry has leading or trailing whitespace");
  }
  for (const ch of ENTRY) {
    const code = ch.codePointAt(0);
    if (code < 0x20 || code === 0x7f || code === 0x2028 || code === 0x2029) {
      fail(`entry contains a control character U+${code.toString(16).toUpperCase().padStart(4, "0")}`);
    }
    // Invisible formatting characters would survive a plain-text read but
    // change the bytes the judge sees, so reject them outright.
    if (
      code === 0xfeff || // BOM / zero-width no-break space
      code === 0x200b || // zero-width space
      code === 0x200c || // zero-width non-joiner
      code === 0x200d || // zero-width joiner
      code === 0x2060 // word joiner
    ) {
      fail(`entry contains an invisible character U+${code.toString(16).toUpperCase().padStart(4, "0")}`);
    }
  }

  const outputDir = process.env.OUTPUT_DIR || "/output";
  // Create the output dir if needed. NEVER remove the dir itself (it may be
  // a grader mount point) — clear only its contents, if anything.
  mkdirSync(outputDir, { recursive: true });
  for (const name of readdirSync(outputDir)) {
    rmSync(join(outputDir, name), { recursive: true, force: true });
  }

  const outPath = join(outputDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");

  // Read back and verify byte-for-byte before declaring success.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY) {
    fail("read-back mismatch: entry.txt does not match the entry exactly");
  }
  // Also verify the byte length matches the entry's UTF-8 encoding, so a
  // stray BOM or encoding quirk cannot slip past the string comparison.
  const expectedBytes = Buffer.byteLength(ENTRY, "utf8");
  const actualBytes = readFileSync(outPath).length;
  if (actualBytes !== expectedBytes) {
    fail(`byte-length mismatch: entry.txt is ${actualBytes} bytes, expected ${expectedBytes}`);
  }

  console.log(`OK: wrote ${length} characters to ${outPath}`);
}

main();
