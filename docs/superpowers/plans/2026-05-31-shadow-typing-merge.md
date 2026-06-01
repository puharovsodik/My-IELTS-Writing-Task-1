# Shadow Typing Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the textarea-based one-phrase-at-a-time `ShadowTypingPage` in the original vanilla React app with the DocumentView document-scroll mechanics from the grammar trainer, while keeping all Variant B styling, navigation, and data structures.

**Architecture:** The original app (`shadow-typing.jsx`, `data.js`, `styles-components.css`) is Variant B (dominant). The grammar trainer TypeScript app (`grammar-trainer/`) is Variant A (mechanics only). We transplant only the keydown/refs pattern and document-scroll UI from Variant A into Variant B, then delete Variant A entirely.

**Tech Stack:** Vanilla React 18 via CDN, no build step, CSS custom properties, Python 3 for data migration

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create + run | `migrate_grammar_notes.py` | Copy per-sentence grammar notes from data.ts into data.js |
| Modify | `styles-components.css` | Add .doc-view, .doc-subnav, .phrase-row, .char--done classes |
| Modify | `shadow-typing.jsx` | Replace ShadowTypingPage with DocumentView mechanics |
| Delete | `grammar-trainer/` | Remove entire TypeScript app (merged into original) |
| Delete | `ielts-grammar-trainer.html` | Remove standalone build artifact |

---

## Task 1: Migrate grammar notes from data.ts into data.js

**Files:**
- Create: `migrate_grammar_notes.py`
- Modify: `data.js`

- [ ] **Step 1: Create migrate_grammar_notes.py**

```python
import re

with open('grammar-trainer/src/data.ts', encoding='utf-8') as f:
    ts = f.read()

with open('data.js', encoding='utf-8') as f:
    js = f.read()

grammar_map = {}
for m in re.finditer(r"text:\s*'((?:[^'\\]|\\.)*)'\s*,\s*grammar:\s*'((?:[^'\\]|\\.)*)'", ts):
    grammar_map[m.group(1)] = m.group(2)

print(f'Found {len(grammar_map)} grammar notes in data.ts')

patched = 0

def add_grammar(m):
    global patched
    text = m.group(1)
    body = m.group(2)
    if text in grammar_map and 'grammar:' not in body:
        note = grammar_map[text].replace("'", "\\'")
        patched += 1
        return f"text: '{text}'{body}, grammar: '{note}'"
    return m.group(0)

result = re.sub(
    r"text:\s*'((?:[^'\\]|\\.)*)'((?:(?!text:).)*?)(?=\s*\})",
    add_grammar,
    js,
    flags=re.DOTALL
)

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(result)

print(f'Patched {patched} sentences in data.js')
```

- [ ] **Step 2: Run the migration**

```bash
python migrate_grammar_notes.py
```

Expected output:
```
Found 110 grammar notes in data.ts
Patched 110 sentences in data.js
```

- [ ] **Step 3: Spot-check data.js**

Open `data.js` and verify a few sentences now have `grammar: '...'` fields. Search for `Not only did` and confirm it has a grammar note.

- [ ] **Step 4: Commit**

```bash
git add migrate_grammar_notes.py data.js
git commit -m "feat: migrate per-sentence grammar notes into data.js"
```

---

## Task 2: Add document view CSS to styles-components.css

**Files:**
- Modify: `styles-components.css`

- [ ] **Step 1: Append the new CSS block at the end of styles-components.css**

```css
/* ── Document View (shadow typing scroll layout) ─────────────────────── */
.doc-view { min-height: 100vh; }

.doc-subnav {
  position: sticky; top: 0; z-index: 9;
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 32px; border-bottom: 1px solid var(--rule);
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
}
.doc-subnav__left  { display: flex; align-items: center; gap: 12px; }
.doc-subnav__right { display: flex; align-items: center; gap: 16px; }

.doc-back-btn {
  font-size: 13px; color: var(--ink-mid);
  border: 1px solid var(--rule-strong); border-radius: 8px;
  padding: 5px 12px; background: var(--paper-2);
  cursor: pointer; text-decoration: none;
}
.doc-back-btn:hover { color: var(--ink); }
.doc-subnav__title { font-weight: 700; font-size: 15px; color: var(--ink); }
.doc-subnav__progress { font-size: 13px; color: var(--ink-mid); font-variant-numeric: tabular-nums; }
.doc-subnav__progress b { color: var(--accent); }

.doc-body { max-width: 760px; margin: 0 auto; padding: 40px 32px 80px; }

.phrase-row { padding: 32px 0; border-bottom: 1px solid var(--rule); cursor: text; }
.phrase-row--done { cursor: default; }

.phrase-row__num {
  font-size: 11px; font-weight: 700; color: var(--ink-mute);
  letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px;
}
.phrase-row__check { margin-left: 8px; color: var(--accent); }

.phrase-row__text {
  font-family: var(--sans); font-size: 1.25rem;
  line-height: 1.8; user-select: none; margin-bottom: 16px;
}
.phrase-row--done .phrase-row__text { opacity: 0.55; }
.phrase-row__text .char--pending { color: var(--ink-mute); opacity: 0.5; }
.phrase-row__text--memory-active .char--pending { opacity: 0; }
.char--done { color: var(--accent); }
```

- [ ] **Step 2: Verify file saved without breaking existing styles**

Open `http://localhost:8080`. Navigate to any page. Check that existing UI looks unchanged (category cards, header, navigation). The new CSS classes are additive and should not affect existing elements.

- [ ] **Step 3: Commit**

```bash
git add styles-components.css
git commit -m "feat: add document view CSS classes"
```

---

## Task 3: Replace ShadowTypingPage with DocumentView mechanics

**Files:**
- Modify: `shadow-typing.jsx`

- [ ] **Step 1: Find the existing ShadowTypingPage function**

Open `shadow-typing.jsx`. Locate `function ShadowTypingPage` — it currently uses a textarea and renders one phrase at a time with a retry queue.

- [ ] **Step 2: Replace the entire ShadowTypingPage function**

Find the block starting with `function ShadowTypingPage` through its closing `}` and replace with:

```jsx
function ShadowTypingPage({ domainId, categoryId }) {
  const category = window.SHADOW_DATA[domainId].categories.find(c => c.id === categoryId);
  const sentences = category.sentences;

  const [activePhraseIndex, setActivePhraseIndex] = useStateST(null);
  const [phraseInputs, setPhraseInputs] = useStateST(() => sentences.map(() => ''));
  const [completedPhrases, setCompletedPhrases] = useStateST(new Set());
  const [mode, setMode] = useStateST('basic');
  const [done, setDone] = useStateST(false);

  const activeRef = useRefST(null);
  const inputsRef = useRefST(sentences.map(() => ''));
  const completedRef = useRefST(new Set());

  useEffectST(() => {
    function handleKeyDown(e) {
      const i = activeRef.current;
      if (i === null || completedRef.current.has(i)) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        setMode(m => m === 'basic' ? 'memory' : 'basic');
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Backspace') {
        inputsRef.current = inputsRef.current.map((t, idx) => idx === i ? t.slice(0, -1) : t);
        setPhraseInputs([...inputsRef.current]);
        return;
      }

      if (e.key.length === 1) {
        const newTyped = inputsRef.current[i] + e.key;
        inputsRef.current = inputsRef.current.map((t, idx) => idx === i ? newTyped : t);
        setPhraseInputs([...inputsRef.current]);

        if (isComplete(newTyped, sentences[i].text)) {
          const newSet = new Set(completedRef.current);
          newSet.add(i);
          completedRef.current = newSet;
          setCompletedPhrases(new Set(newSet));
          if (newSet.size === sentences.length) setTimeout(() => setDone(true), 600);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sentences]);

  function handlePhraseClick(i) {
    if (completedRef.current.has(i)) return;
    activeRef.current = i;
    setActivePhraseIndex(i);
  }

  if (done) return React.createElement(ShadowCompletePage, { domainId, categoryId });

  return React.createElement('div', { className: 'doc-view' },
    React.createElement('div', { className: 'doc-subnav' },
      React.createElement('div', { className: 'doc-subnav__left' },
        React.createElement('a', {
          href: '#/' + domainId,
          className: 'doc-back-btn',
          onClick: e => { e.preventDefault(); nav('/' + domainId); }
        }, '← Back'),
        React.createElement('span', { className: 'doc-subnav__title' },
          category.icon + ' ' + category.title
        )
      ),
      React.createElement('div', { className: 'doc-subnav__right' },
        React.createElement('div', { className: 'mode-toggle' },
          React.createElement('button', {
            className: 'mode-btn' + (mode === 'basic' ? ' mode-btn--active' : ''),
            onClick: () => setMode('basic')
          }, 'Basic'),
          React.createElement('button', {
            className: 'mode-btn' + (mode === 'memory' ? ' mode-btn--active' : ''),
            onClick: () => setMode('memory')
          }, 'Memory')
        ),
        React.createElement('span', { className: 'doc-subnav__progress' },
          React.createElement('b', null, completedPhrases.size),
          ' / ' + sentences.length
        )
      )
    ),
    React.createElement('div', { className: 'doc-body' },
      sentences.map((sentence, i) => {
        const isActive = activePhraseIndex === i;
        const isDone = completedPhrases.has(i);
        const typed = phraseInputs[i];
        const statuses = getCharStatus(typed, sentence.text);
        const memoryActive = mode === 'memory' && isActive;

        return React.createElement('div', {
          key: i,
          className: 'phrase-row' + (isDone ? ' phrase-row--done' : '') + (isActive ? ' phrase-row--active' : ''),
          onClick: () => handlePhraseClick(i)
        },
          React.createElement('div', { className: 'phrase-row__num' },
            String(i + 1).padStart(2, '0'),
            isDone && React.createElement('span', { className: 'phrase-row__check' }, '✓')
          ),
          React.createElement('div', {
            className: 'phrase-row__text' + (memoryActive ? ' phrase-row__text--memory-active' : '')
          },
            sentence.text.split('').map((char, j) => {
              if (isDone) return React.createElement('span', { key: j, className: 'char char--done' }, char);
              return React.createElement('span', { key: j, className: 'char char--' + statuses[j] }, char);
            })
          ),
          sentence.grammar && React.createElement(GrammarNote, { note: sentence.grammar, band: sentence.band })
        );
      })
    )
  );
}
```

- [ ] **Step 3: Verify app loads in browser**

Refresh `http://localhost:8080`. Open any shadow typing category. Verify:
1. All phrases visible simultaneously in a scrollable list
2. Numbered 01, 02, 03...
3. Click any phrase — cursor highlight appears on first char
4. Type correct char — turns correct color
5. Type wrong char — turns red
6. Backspace — removes last char
7. Complete phrase — turns accent color with checkmark, click does nothing
8. Tab — toggles Basic/Memory mode
9. Complete all phrases — completion screen appears after 600ms
10. Grammar notes appear below each phrase

- [ ] **Step 4: Commit**

```bash
git add shadow-typing.jsx
git commit -m "feat: replace textarea typing with document scroll view"
```

---

## Task 4: Delete grammar-trainer and build artifact

**Files:**
- Delete: `grammar-trainer/` (entire directory)
- Delete: `ielts-grammar-trainer.html`
- Delete: `migrate_grammar_notes.py` (cleanup)

- [ ] **Step 1: Delete files**

```bash
rm -rf grammar-trainer
rm ielts-grammar-trainer.html
rm migrate_grammar_notes.py
```

- [ ] **Step 2: Verify nothing references grammar-trainer**

```bash
grep -r "grammar-trainer" . --include="*.html" --include="*.js" --include="*.jsx" --include="*.md" -l 2>/dev/null
```

Expected: no output (or only docs/plans files).

- [ ] **Step 3: Commit and push**

```bash
git add -A
git commit -m "chore: remove grammar-trainer — merged into original app"
git push origin main
```

Expected: push succeeds, GitHub Pages reflects the merged app.
