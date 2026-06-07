# Guidebook Chart Guides & Cheatsheets — Design

## Context

The repo root contains 6 standalone "masterclass" HTML files and 6 standalone "cheatsheet" HTML files, one per Task 1 visual type (Bar Charts, Line Graphs, Pie Charts, Maps, Process Diagrams, Tables). They are not connected to the React app, each has its own bespoke CSS, and they require opening separate files outside the trainer.

Goal: bring this content into the app, give it one consistent design per content type (Guide vs Cheatsheet), make it reachable from the Guidebook domain, and retire the standalone HTML files.

## Navigation

`Task 1` group restructures from a flat node list (`['instruction', 'cheatsheet']`) into two hub sections, each containing 6 chart-type pages:

```
/guidebook/task1                          → GroupPage: cards "Guide" and "Cheatsheet"
/guidebook/task1/guide                    → hub: 6 chart-type cards
/guidebook/task1/guide/bar-charts         → GuidePage (model sentences, templates, checklist)
/guidebook/task1/cheatsheet               → hub: 6 chart-type cards
/guidebook/task1/cheatsheet/bar-charts    → ChartCheatsheetPage (structures, collocations, tips)
```

This is a 4-segment route for the deepest pages — the current dispatcher in `app.jsx` only handles up to `route.length === 3`. It needs a new branch for the guidebook domain at depth 4, and `TopBar` breadcrumb logic needs a new case for this 4-level guidebook path.

The existing general `guidebook/task1` entries in `window.INSTRUCTIONS` and `window.CHEATSHEETS` (and their `/instruction`, `/cheatsheet` routes) are removed — replaced entirely by the new Guide/Cheatsheet hub structure.

`Task 2` is untouched: its `instruction`/`cheatsheet` nodes and routes stay exactly as they are.

## Data structure

Two new global content tables in `data.js`, keyed the same way as `INSTRUCTIONS`/`CHEATSHEETS`:

```js
window.GUIDES = {
  'guidebook/task1/bar-charts': {
    title: 'Bar Charts',
    eyebrow: 'Task 1 · Guide',
    deck: '...',
    sections: [
      {
        title: 'Introduction Templates',
        intro: '...',
        template: 'The bar chart {illustrates/compares} the {what} in {n} {categories}…',
        sentences: [
          {
            label: 'Model 1 — Basic Paraphrase (Band 6)',
            parts: [
              { text: 'The bar chart', role: 'subject' },
              { text: 'illustrates', role: 'verb' },
              { text: 'the amount of water consumed per person', role: 'object' },
              { text: 'in six countries in 2020', role: 'time' }
            ],
            note: '✔ [SUBJECT] + [verb] + [what] + [scope]. Safe and correct.'
          }
        ]
      }
    ],
    checklist: ['...']
  }
  // … one entry per chart type
};

window.CHART_CHEATSHEETS = {
  'guidebook/task1/bar-charts': {
    title: 'Bar Charts',
    eyebrow: 'Task 1 · Cheatsheet',
    structures: [{ pattern: '...', example: '...' }],
    collocations: [{ phrase: '...', use: '...' }],
    staticDynamic: { static: ['...'], dynamic: ['...'] },
    danger: ['...'],
    tips: ['...'],
    prepositions: [{ key: '...', value: '...' }]
  }
  // … one entry per chart type
};
```

Chart-type ids (`bar-charts`, `line-graphs`, `pie-charts`, `maps`, `processes`, `tables`) match the existing `practice.task1` topic ids for consistency across the app.

## Components

New components, added to `screens.jsx` (or a new `guide-pages.jsx` if the file would grow too large):

- **`GuideHubPage` / `CheatsheetHubPage`** — topic-selection grids for the two hubs, reusing the visual pattern of the existing `TopicGrid`
- **`GuidePage`** — renders a guide's sections: intro text, fill-in-the-blank template, list of `ModelSentence` cards, checklist (reusing the existing `.checklist` pattern from `InstructionPage`)
- **`ChartCheatsheetPage`** — renders a cheatsheet's panels: structures, collocations, static/dynamic vocab, danger, tips, prepositions
- **`ModelSentence`** — renders a sentence as colored spans by grammatical `role` (subject/verb/object/connector/time), with a note line below

## Visual design

Page chrome (header, deck, typography, light/dark switching) stays systemic — same patterns as `InstructionPage`/`CheatsheetPage`, driven by the app's existing CSS variables.

Within content, new block types get their own visual identity, expressed through the app's color system (so dark mode keeps working) rather than the hard-coded palettes from the source HTML (`--accent`, `--gold`, `--teal`, etc.):

- **Model Sentence** — card with color-coded grammatical roles + an analysis note beneath, in the spirit of the existing `anatomy.blocks`, but coloring at the word/phrase level
- **Template box** — dashed border, monospace, explicit fill-in slots (`<span class="blank">`)
- **Structure panel** (cheatsheet) — compact pattern list: monospace skeleton + italic example
- **Tip / Danger callout** — colored box using the app's existing warning-style variables

New CSS classes land in `styles-components.css`.

## Content migration

This is the bulk of the work — not scaffolding, but rewriting ~12 pages worth of dense educational content (each masterclass has ~5 sections and ~35 model sentences; each cheatsheet has structure/collocation/vocab panels) from bespoke HTML markup into the structured JS objects above.

Approach: extract the substance — sentence text and its subject/verb/object/connector breakdown, fill-in templates, checklists, collocations, danger/tip notes — and re-encode it as data. Decorative elements that carry no learning value (SVG bar-chart diagrams, header stat counters, page-specific background watermarks) are dropped; they would only add maintenance burden for no pedagogical gain.

## Cleanup

After migration and verification, all 12 standalone HTML files are deleted from the repo root:
`ielts-bar-chart-masterclass.html`, `ielts-line-graph-masterclass.html`, `ielts-map-masterclass.html`, `ielts-piechart-masterclass.html`, `ielts-process-diagram-masterclass.html`, `ielts-task1-table-masterclass.html`, `ielts-barchart-cheatsheet.html`, `ielts-line-graph-cheat-sheet.html`, `ielts-map-cheat-sheet.html`, `ielts-piechart-cheatsheet.html`, `ielts-process-cheat-sheet.html`, `ielts-table-cheatsheet.html`.
