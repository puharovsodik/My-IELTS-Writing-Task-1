# Document View — Design Spec
Date: 2026-05-27

## Overview

Replace the one-phrase-at-a-time typing screen with a scrollable document view.
All phrases in a category are visible simultaneously (monkeytype-style).
The user can click any phrase to type it in any order.
Grammar notes are always visible below each phrase.

---

## What Changes

| Before | After |
|---|---|
| One phrase at a time, auto-advance | All 10 phrases on one scrollable page |
| Retry queue (phrases with errors re-queued) | User manually re-clicks a phrase to redo it |
| 800ms delay between phrases | No delay — instant focus on click |
| Card UI per phrase | Flat document style, dividers between phrases |

---

## New Components

### `DocumentView.tsx`
Main component. Replaces `TypingArea` on the `'typing'` screen.

**Props** (same interface as TypingArea):
```ts
interface DocumentViewProps {
  category: Category
  sentences: Sentence[]
  onComplete: () => void
  onBack: () => void
}
```

`mode` ('basic' | 'memory') is managed internally by DocumentView, same as TypingArea does now. Tab key toggles it.

**State:**
```ts
activePhraseIndex: number | null   // which phrase has keyboard focus
phraseInputs: string[]             // typed text per phrase, indexed by position
completedPhrases: Set<number>      // indices of fully-correct phrases
```

**Keyboard logic:**
- `keydown` fires on `window` when a phrase is active
- Backspace → remove last char from `phraseInputs[activePhraseIndex]`
- Printable single char (no Ctrl/Meta/Alt) → append to `phraseInputs[activePhraseIndex]`
- Tab → toggle Basic/Memory mode (same as current)
- After each keystroke: check `isComplete(phraseInputs[i], sentences[i].text)` → if true, add to `completedPhrases`
- When `completedPhrases.size === sentences.length` → call `onComplete()`

**Completion check:** reuse existing `isComplete()` from `utils/typing.ts`.
A phrase is "done" only when `isComplete()` returns true (typed text exactly matches original — no errors).
If the user types the full length with errors, the phrase stays active; they must backspace to correct.

**Character status:** reuse existing `getCharStatus()` from `utils/typing.ts`.

---

### `PhraseRow.tsx`
Renders a single phrase block. Used inside DocumentView.

**Props:**
```ts
interface PhraseRowProps {
  sentence: Sentence
  typed: string
  isActive: boolean
  isDone: boolean
  mode: 'basic' | 'memory'
  index: number
  onClick: () => void
}
```

**Visual states:**
- **pending** — phrase text gray (`var(--ink-faint)`), grammar note visible
- **active** — cursor blinking at `typed.length` position, correct chars dark, wrong chars red
- **done** — phrase text `var(--accent)` at low opacity (~60%), ✓ badge right-aligned

**Character rendering (active/done):**
- Correct typed char → `var(--ink)` (dark)
- Wrong typed char → `var(--error)` (red)
- Cursor position → green blinking `|` before next pending char
- Pending chars → `var(--ink-faint)` (gray)

**Memory mode:** pending chars rendered as transparent (invisible) instead of gray.
Typed chars always visible regardless of mode.

**Grammar note:** always rendered below the phrase text, never hidden.
Uses existing `GrammarNote` component (or inline equivalent).

---

## Modified Files

### `App.tsx`
- Import `DocumentView` instead of `TypingArea` on the `'typing'` screen
- `TypingArea.tsx` stays untouched

One-line change in the render switch:
```tsx
// before
case 'typing': return <TypingArea ... />
// after
case 'typing': return <DocumentView ... />
```

App.tsx doesn't pass mode — DocumentView manages it internally.

---

## Layout

### Sticky Header
Same sticky glassmorphism header as current:
- Back button (← calls `onBack`)
- Category icon + name
- Basic / Memory mode pill toggle
- Progress: `X / 10` where X = `completedPhrases.size`

### Document Body
```
max-width: 760px, centered, padding: 40px 32px 80px
```

Each `PhraseRow` separated by `border-bottom: 1px solid var(--border)`.
No rounded cards, no box shadows.

Phrase number label (`01`, `02`, …) above each phrase in small gray uppercase.

---

## What's Removed

- Retry queue (`nextQueueState`, `queue` state) — not needed
- `phraseHadErrorRef` — not needed
- 800ms success delay — not needed
- `isRetrying` indicator — not needed

These utilities stay in `utils/queue.ts` (untouched), just not used by DocumentView.

---

## Out of Scope

- Shuffle mode — not changed (App still shuffles `sentences` before passing to DocumentView, same as before)
- CategoryComplete screen — not changed
- `CategorySelector` — not changed
- All other components — not changed
