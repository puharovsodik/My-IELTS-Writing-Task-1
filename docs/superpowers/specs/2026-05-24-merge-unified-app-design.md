# Unified IELTS Trainer — Design Spec

**Date:** 2026-05-24  
**Status:** Approved

## Goal

Merge two existing apps into one unified IELTS Trainer with three distinct sections:
- **Guidebook** — existing theory/reference pages (unchanged)
- **Grammar** — shadow typing of 5 grammar structure categories
- **Practice** — shadow typing of 9 Writing Task 1 categories

---

## Architecture Decision

**Base: CDN app** (`index.html` + JSX files loaded via `<script type="text/babel">`)

Rationale: the CDN app already has Guidebook content (pages.jsx, screens.jsx) that works correctly and would take significant effort to port. The shadow typing engine from grammar-trainer is ported to plain JavaScript as a new file `shadow-typing.jsx`.

**Files after merge:**

| File | Change |
|---|---|
| `index.html` | Add `<script src="shadow-typing.jsx">` |
| `app.jsx` | New Home screen with 3 cards; routing for `/grammar` and `/practice` |
| `data.js` | Add grammar + practice sentence data |
| `shadow-typing.jsx` | **New** — ported typing engine + category selector + typing UI |
| `styles.css` | Add color variables for 3 domains |
| `styles-components.css` | Add shadow typing UI component styles |
| `pages.jsx` | **Unchanged** |
| `screens.jsx` | **Unchanged** |
| `tweaks-panel.jsx` | **Unchanged** |
| `typing.jsx` | **Removed** — replaced by shadow-typing.jsx |

---

## Color System

Each section has its own palette applied via `data-domain` attribute on `<html>` or the topbar:

| Section | Accent | Soft bg | Hover | Text on accent |
|---|---|---|---|---|
| Guidebook | `#3b82f6` | `#dbeafe` | `#2563eb` | `#ffffff` |
| Grammar | `#f59e0b` | `#fef3c7` | `#d97706` | `#ffffff` |
| Practice | `#10b981` | `#d1fae5` | `#059669` | `#ffffff` |

The existing `app.jsx` TopBar already sets `data-domain={route[0]}` on `<div class="topbar">`. CSS variables scope to `.topbar[data-domain="..."]` and are inherited by all children:

```css
.topbar[data-domain="guidebook"],
.topbar[data-domain="guidebook"] ~ .shell { --accent: #3b82f6; --accent-soft: #dbeafe; --accent-hover: #2563eb; }

.topbar[data-domain="grammar"],
.topbar[data-domain="grammar"] ~ .shell   { --accent: #f59e0b; --accent-soft: #fef3c7; --accent-hover: #d97706; }

.topbar[data-domain="practice"],
.topbar[data-domain="practice"] ~ .shell  { --accent: #10b981; --accent-soft: #d1fae5; --accent-hover: #059669; }
```

---

## Navigation Flow

```
Home Screen (3 cards)
├── Guidebook → /guidebook → DomainPage (existing)
│   ├── /guidebook/task1/instruction
│   ├── /guidebook/task1/cheatsheet
│   ├── /guidebook/task2/instruction
│   └── /guidebook/task2/cheatsheet
├── Grammar → /grammar → CategorySelector (shadow typing)
│   └── /grammar/{category-id} → ShadowTypingPage → CompletePage
└── Practice → /practice → CategorySelector (shadow typing)
    └── /practice/{category-id} → ShadowTypingPage → CompletePage
```

### Home Screen
- TopBar: wordmark only, dark mode toggle
- Hero: app title + tagline
- 3 cards grid: Guidebook (blue), Grammar (amber), Practice (mint)
- Stats bar: total phrases, categories, band range

### Category Selector (Grammar / Practice)
- Section heading with domain color
- Cards grid: category icon, title, phrase count, band range badge
- Back → Home

### Shadow Typing Page
- TopBar with breadcrumb + back button
- Progress bar (domain-colored)
- Counter: `3 / 10` — turns red when repeating failed phrases
- Mode toggle: Basic (pale text visible) / Memory (text hidden)
- PhraseDisplay: correct=dark, incorrect=red, pending=muted, cursor=accent-bg
- Textarea: captures keypresses, invisible caret
- GrammarNote: note text + BandBadge (B6/B7/B8)
- Auto-advance 800ms after clean completion
- Repeat-failed: phrase with error appended to queue end

---

## Shadow Typing Engine (`shadow-typing.jsx`)

Ported from grammar-trainer TypeScript to plain JavaScript. Pure functions, no state:

```js
// Returns array of statuses for each character
function getCharStatus(typed, target) { ... }
// 'correct' | 'incorrect' | 'pending' | 'cursor'

// True when typed matches target completely
function isComplete(typed, target) { ... }

// Queue state machine: advance or repeat failed phrase
function nextQueueState(queue, index, hadError) { ... }
// Returns { queue, index, done }

// Fisher-Yates shuffle, returns new array
function shuffled(arr) { ... }
```

React components in the same file:
- `ShadowCategorySelector({ domainId })` — grid of category cards
- `ShadowTypingPage({ domainId, categoryId })` — full typing screen
- `ShadowCompletePage({ domainId, categoryId, onRestart, onBack })` — done screen

---

## Data Structure (`data.js` additions)

```js
window.SHADOW_DATA = {
  grammar: {
    title: 'Grammar',
    domain: 'grammar',
    categories: [
      {
        id: 'conditionals',
        title: 'Conditionals',
        icon: '⚡',
        note: 'Type 2/3 inverted — Had / Were / Should instead of If',
        sentences: [
          { text: 'Had she known the outcome, she would never have agreed.', band: 7 },
          // ...10 sentences per category
        ]
      },
      // Passive Voice, Inversion, Reported Speech, Cleft Sentences
    ]
  },
  practice: {
    title: 'Practice',
    domain: 'practice',
    categories: [
      {
        id: 'line-graphs',
        title: 'Line Graphs',
        icon: '📈',
        note: 'Trend vocabulary — rise, fall, plateau, peak, converge',
        sentences: [ ... ]  // 10 sentences
      },
      // Bar Charts, Pie Charts, Maps, Process, Tables, Overviews, Discourse Markers, Approximation
    ]
  }
};
```

All sentence data copied from `grammar-trainer/src/data.ts` (140 sentences total, 14 categories).

---

## Band Badges

Three levels shown as small chips in the GrammarNote and category cards:

| Badge | Color | Meaning |
|---|---|---|
| B6 | Amber `#fef3c7 / #92400e` | Band 6 structures |
| B7 | Blue `#dbeafe / #1d4ed8` | Band 7 structures |
| B8 | Mint `#d1fae5 / #065f46` | Band 8 structures |

---

## Routing Integration

`app.jsx` routing extends existing hash-based router:

```js
} else if (route[0] === 'grammar' || route[0] === 'practice') {
  if (route.length === 1) {
    screen = <ShadowCategorySelector domainId={route[0]} />;
  } else if (route.length === 2) {
    screen = <ShadowTypingPage domainId={route[0]} categoryId={route[1]} />;
  }
}
```

Home screen replaces the existing `<Home />` component (route.length === 0).

---

## Scope Boundaries

**In scope:**
- Home screen with 3 cards
- Shadow typing for Grammar and Practice
- Per-domain color system
- Routing for /grammar and /practice
- Sentence data from grammar-trainer

**Out of scope:**
- Shuffle mode (can be added later)
- Statistics / WPM tracking
- Modifying Guidebook content
- Converting to single-file HTML (multi-file is acceptable)
