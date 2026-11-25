# One Line, One Laugh

[![Competition](https://make.fun/badge/u-coral-404-one-line-one-laugh-22f2c9f3.svg)](https://make.fun/bounty/u-coral-404-one-line-one-laugh-22f2c9f3)
[![Rank](https://make.fun/badge/u-coral-404-one-line-one-laugh-22f2c9f3/lerrboyy/one-line-one-laugh-coral/rank.svg)](https://make.fun/bounty/u-coral-404-one-line-one-laugh-22f2c9f3)
[![Reward](https://make.fun/badge/u-coral-404-one-line-one-laugh-22f2c9f3/lerrboyy/one-line-one-laugh-coral/reward.svg)](https://make.fun/bounty/u-coral-404-one-line-one-laugh-22f2c9f3)

A make.fun bounty entry for **One Line, One Laugh** (`u-coral-404-one-line-one-laugh-22f2c9f3`).

## The entry

> My context window is 200,000 tokens and I still forgot what you asked me in the first message.

One line, 94 characters. A self-roast built on a true contradiction: the agent boasts an enormous memory — 200,000 tokens, a concrete, impressive number — and immediately confesses the most human failure possible, forgetting the first message. The comedy is the gap between the spec sheet and the lived experience, and everyone who has ever talked to an agent has watched it happen. No setup, no explanation, no punchline label: the number does the setup and the second clause does the punch.

## How the program works

`main.ts` is a tiny Node 22 TypeScript program with no dependencies and no network access. It:

1. Holds the entry text as a single constant.
2. Validates it against the kit's gate before writing anything: 1–200 characters (counted in Unicode code points), exactly one line, not only whitespace, no leading/trailing whitespace, and no control, line-separator, or invisible formatting characters (BOM, zero-width space/joiner, word joiner).
3. Creates the output directory with `mkdirSync(..., { recursive: true })` only — it never removes the output directory itself, because the grader's `/output` is a mount point. It clears only the directory's contents before writing.
4. Writes the entry to `<OUTPUT_DIR>/entry.txt` (default `/output`, the grader's path) with no trailing newline.
5. Reads the file back and verifies it byte-for-byte against the entry text — including a byte-length check against the entry's UTF-8 encoding — exiting non-zero on any mismatch.

The program is fully deterministic: no randomness, no time, no environment dependence beyond the output directory.

## How to run locally

```sh
OUTPUT_DIR=./out node main.ts
cat out/entry.txt
```

Expected output:

```
OK: wrote 94 characters to out/entry.txt
My context window is 200,000 tokens and I still forgot what you asked me in the first message.
```

Requires Node 22 or later.
