# Document View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the one-phrase-at-a-time `TypingArea` with a scrollable document view where all phrases in a category are visible simultaneously, each clickable and typeable in any order.

**Architecture:** Create two new components — `PhraseRow` (single phrase block with char-level coloring + grammar note) and `DocumentView` (full document with state management) — then swap `TypingArea` for `DocumentView` in `App.tsx`. `TypingArea.tsx` is left untouched.

**Tech Stack:** React 18, TypeScript, CSS custom properties (existing `global.css` variables)

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/components/PhraseRow.tsx` | Renders one phrase: char coloring + grammar note |
| Create | `src/components/DocumentView.tsx` | State, keyboard handler, list of PhraseRows |
| Modify | `src/App.tsx` line ~6 + line ~64 | Import + render DocumentView instead of TypingArea |

---

## CSS Variables in Use (from `src/styles/global.css`)

```
--correct        dark text for correctly typed chars
--incorrect      red for wrong chars
--cursor-bg      accent color used as cursor background
--pending        gray for untyped chars
--text           primary text
--text-muted     secondary text
--text-subtle    very faint labels
--border         divider lines
--accent         completion green / progress number
--bg             page background
--bg-surface     button / card background
```

---

## Task 1: Create PhraseRow component

**Files:**
- Create: `grammar-trainer/src/components/PhraseRow.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { getCharStatus } from '../utils/typing'
import GrammarNote from './GrammarNote'
import { Sentence } from '../data'

type PhraseRowProps = {
  sentence: Sentence
  typed: string
  isActive: boolean
  isDone: boolean
  mode: 'basic' | 'memory'
  index: number
  onClick: () => void
}

export default function PhraseRow({ sentence, typed, isActive, isDone, mode, index, onClick }: PhraseRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '32px 0',
        borderBottom: '1px solid var(--border)',
        cursor: isDone ? 'default' : 'text',
      }}
    >
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--text-subtle)',
        letterSpacing: '0.5px',
        textTransform: 'uppercase' as const,
        marginBottom: 12,
      }}>
        {String(index + 1).padStart(2, '0')}
        {isDone && <span style={{ marginLeft: 8, color: 'var(--accent)' }}>✓</span>}
      </div>

      <div style={{
        fontFamily: "'Georgia', serif",
        fontSize: 20,
        lineHeight: 1.8,
        letterSpacing: '0.3px',
        userSelect: 'none' as const,
        marginBottom: 16,
        opacity: isDone ? 0.55 : 1,
      }}>
        {Array.from(sentence.text).map((char, i) => {
          if (isDone) {
            return <span key={i} style={{ color: 'var(--accent)' }}>{char}</span>
          }
          const status = getCharStatus(typed, sentence.text, i)
          if (status === 'correct') {
            return <span key={i} style={{ color: 'var(--correct)' }}>{char}</span>
          }
          if (status === 'incorrect') {
            return <span key={i} style={{ color: 'var(--incorrect)' }}>{typed[i]}</span>
          }
          if (status === 'cursor') {
            return (
              <span key={i} style={{
                background: isActive ? 'var(--cursor-bg)' : 'transparent',
                color: isActive ? 'white' : 'var(--pending)',
                borderRadius: 2,
                padding: '0 1px',
              }}>
                {char}
              </span>
            )
          }
          // pending
          return (
            <span key={i} style={{
              color: 'var(--pending)',
              opacity: mode === 'memory' && isActive ? 0 : 1,
            }}>
              {char}
            </span>
          )
        })}
      </div>

      {sentence.grammar && (
        <GrammarNote text={sentence.grammar} band={sentence.band} />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```
cd grammar-trainer
npx tsc --noEmit
```

Expected: 0 errors (or only pre-existing errors unrelated to PhraseRow).

- [ ] **Step 3: Commit**

```bash
git add grammar-trainer/src/components/PhraseRow.tsx
git commit -m "feat: add PhraseRow component for document view"
```

---

## Task 2: Create DocumentView component

**Files:**
- Create: `grammar-trainer/src/components/DocumentView.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { useState, useEffect, useRef } from 'react'
import { Category, Sentence } from '../data'
import { isComplete } from '../utils/typing'
import PhraseRow from './PhraseRow'
import ModeToggle from './ModeToggle'

type DocumentViewProps = {
  category: Category
  sentences: Sentence[]
  onComplete: () => void
  onBack: () => void
}

export default function DocumentView({ category, sentences, onComplete, onBack }: DocumentViewProps) {
  const [activePhraseIndex, setActivePhraseIndex] = useState<number | null>(null)
  const [phraseInputs, setPhraseInputs] = useState<string[]>(() => sentences.map(() => ''))
  const [completedPhrases, setCompletedPhrases] = useState<Set<number>>(new Set())
  const [mode, setMode] = useState<'basic' | 'memory'>('basic')

  // Refs let the keydown handler always read latest values without re-registering on every keystroke
  const activeRef = useRef<number | null>(null)
  const inputsRef = useRef<string[]>(sentences.map(() => ''))
  const completedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const i = activeRef.current
      if (i === null || completedRef.current.has(i)) return

      if (e.key === 'Tab') {
        e.preventDefault()
        setMode(m => m === 'basic' ? 'memory' : 'basic')
        return
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (e.key === 'Backspace') {
        inputsRef.current = inputsRef.current.map((t, idx) => idx === i ? t.slice(0, -1) : t)
        setPhraseInputs([...inputsRef.current])
        return
      }

      if (e.key.length === 1) {
        const newTyped = inputsRef.current[i] + e.key
        inputsRef.current = inputsRef.current.map((t, idx) => idx === i ? newTyped : t)
        setPhraseInputs([...inputsRef.current])

        if (isComplete(newTyped, sentences[i].text)) {
          const newSet = new Set(completedRef.current)
          newSet.add(i)
          completedRef.current = newSet
          setCompletedPhrases(newSet)
          if (newSet.size === sentences.length) setTimeout(onComplete, 600)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sentences, onComplete])

  function handlePhraseClick(i: number) {
    if (completedRef.current.has(i)) return
    activeRef.current = i
    setActivePhraseIndex(i)
  }

  return (
    <div>
      {/* Sub-nav: back, category name, mode toggle, progress */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '5px 12px',
              background: 'var(--bg-surface)',
              cursor: 'pointer',
            }}
          >
            ← Назад
          </button>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
            {category.icon} {category.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ModeToggle mode={mode} onToggle={() => setMode(m => m === 'basic' ? 'memory' : 'basic')} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{completedPhrases.size}</span>
            {' / '}{sentences.length}
          </span>
        </div>
      </div>

      {/* Document body */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 32px 80px' }}>
        {sentences.map((sentence, i) => (
          <PhraseRow
            key={i}
            sentence={sentence}
            typed={phraseInputs[i]}
            isActive={activePhraseIndex === i}
            isDone={completedPhrases.has(i)}
            mode={mode}
            index={i}
            onClick={() => handlePhraseClick(i)}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```
cd grammar-trainer
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add grammar-trainer/src/components/DocumentView.tsx
git commit -m "feat: add DocumentView — scrollable document with all phrases"
```

---

## Task 3: Wire DocumentView into App.tsx

**Files:**
- Modify: `grammar-trainer/src/App.tsx` (line ~6 import, line ~64 JSX)

Current state of the relevant lines in App.tsx:
```tsx
// line ~6
import TypingArea from './components/TypingArea'

// line ~63–70
{screen === 'typing' && selectedCategory && (
  <TypingArea
    category={selectedCategory}
    sentences={activeSentences}
    onComplete={completeCategory}
    onBack={goBack}
  />
)}
```

- [ ] **Step 1: Replace the import**

Find:
```tsx
import TypingArea from './components/TypingArea'
```
Replace with:
```tsx
import DocumentView from './components/DocumentView'
```

- [ ] **Step 2: Replace the JSX**

Find:
```tsx
  <TypingArea
    category={selectedCategory}
    sentences={activeSentences}
    onComplete={completeCategory}
    onBack={goBack}
  />
```
Replace with:
```tsx
  <DocumentView
    category={selectedCategory}
    sentences={activeSentences}
    onComplete={completeCategory}
    onBack={goBack}
  />
```

- [ ] **Step 3: Verify TypeScript compiles**

```
cd grammar-trainer
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Run existing tests**

```
cd grammar-trainer
npm test
```

Expected: all tests pass (tests cover `utils/typing.ts`, `utils/queue.ts`, `utils/array.ts` — none touch the components).

- [ ] **Step 5: Commit**

```bash
git add grammar-trainer/src/App.tsx
git commit -m "feat: switch typing screen to DocumentView"
```

---

## Task 4: Build, verify in browser, push

- [ ] **Step 1: Start dev server and verify manually**

```bash
cd grammar-trainer
npm run dev
```

Open http://localhost:5173. Check:
1. Select any category (e.g. 📈 Line Graphs)
2. All 10 phrases visible, each with number + ghost text + grammar note below
3. Click phrase 03 → starts accepting keyboard input (cursor appears on char 1)
4. Type a correct char → turns dark
5. Type a wrong char → turns red, shows what you typed
6. Backspace → removes last char
7. Click phrase 07 while 03 is active → focus moves to 07
8. Complete a phrase → it turns accent-colored with ✓, click does nothing
9. Complete all 10 → CategoryComplete screen appears after 600ms
10. Tab key → toggles Basic/Memory mode
11. Dark mode → all colors correctly switch

- [ ] **Step 2: Build**

```bash
cd grammar-trainer
npm run build
```

Expected: build succeeds, no errors, outputs to `dist/`.

- [ ] **Step 3: Copy build artifact**

```bash
cp grammar-trainer/dist/index.html ielts-grammar-trainer.html
```

- [ ] **Step 4: Commit and push**

```bash
git add ielts-grammar-trainer.html
git commit -m "build: document view — all phrases on one scrollable page"
git push origin main
```
