import re, os, shutil, sys

# Run from repo root via: python3 /c/Users/Sodiq/AppData/Local/Temp/mgn.py
# CWD must be the repo root when running

with open('grammar-trainer/src/data.ts', encoding='utf-8') as f:
    ts = f.read()

with open('data.js', encoding='utf-8') as f:
    js = f.read()

# Build map: text -> grammar note from data.ts
# Handles both single and double quoted strings, and escaped quotes
grammar_map = {}

# Match: text: '...', grammar: '...'  (single quotes)
for m in re.finditer(
    r"text:\s*'((?:[^'\\]|\\.)*)'\s*,\s*grammar:\s*'((?:[^'\\]|\\.)*)'",
    ts
):
    grammar_map[m.group(1)] = m.group(2)

print(f'Found {len(grammar_map)} grammar notes in data.ts')

patched = 0

def add_grammar_note(m):
    global patched
    full_match = m.group(0)
    text = m.group(1)
    trailing = m.group(2)

    if text not in grammar_map:
        return full_match

    # Skip if grammar already present in the full object
    # We need to look at the surrounding context - check from text: up to closing }
    if 'grammar:' in trailing:
        return full_match

    note = grammar_map[text].replace("\\", "\\\\").replace("'", "\\'")
    patched += 1

    # Insert grammar: 'note' before the closing } of this object
    # trailing currently ends just before the }
    return f"text: '{text}'{trailing}, grammar: '{note}'"


# Pattern: matches text: 'xxx' followed by anything up to (but not including) the closing }
# The trailing group captures optional band field etc.
result = re.sub(
    r"text:\s*'((?:[^'\\]|\\.)*)'((?:(?!\}).)*?)(?=\s*\})",
    add_grammar_note,
    js,
    flags=re.DOTALL
)

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(result)

print(f'Patched {patched} sentences in data.js')
# Note: one sentence uses double quotes in data.js (Transport claimed the lion's share...)
# and must be patched manually — the regex only matches single-quoted text fields.
