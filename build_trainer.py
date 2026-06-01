"""
build_trainer.py — bundles the IELTS Writing Trainer into a single HTML file.
Run: python build_trainer.py
Output: ielts-grammar-trainer.html (replaces existing)
"""

import os, re

BASE = os.path.dirname(os.path.abspath(__file__))

def read(name):
    with open(os.path.join(BASE, name), encoding='utf-8') as f:
        return f.read()

# ── Updated data (guidebook task1 now has chart-specific entries) ─────────────
DATA_JS = r"""
window.IELTS_DATA = {
  domains: [
    {
      id: 'guidebook',
      title: 'Guidebook',
      kicker: 'Theory & Reference',
      tagline: 'Structural anatomy of the Writing test — what examiners look for, what to deliver, how to score.',
      summary: 'Static reference. Read once, return often. Six chart-type masterclasses for Task 1, plus full Task 2 theory.',
      groups: [
        {
          id: 'task1',
          title: 'Writing Task 1',
          meta: '20 min · 150 words',
          charts: [
            { id: 'line-graphs',  title: 'Line Graphs',  meta: 'Trends over time',      masterclass: 'ielts-line-graph-masterclass.html',      cheatsheet: 'ielts-line-graph-cheat-sheet.html' },
            { id: 'bar-charts',   title: 'Bar Charts',   meta: 'Discrete comparison',   masterclass: 'ielts-bar-chart-masterclass.html',       cheatsheet: 'ielts-barchart-cheatsheet.html' },
            { id: 'pie-charts',   title: 'Pie Charts',   meta: 'Proportions',           masterclass: 'ielts-piechart-masterclass.html',        cheatsheet: 'ielts-piechart-cheatsheet.html' },
            { id: 'maps',         title: 'Maps',         meta: 'Spatial change',         masterclass: 'ielts-map-masterclass.html',             cheatsheet: 'ielts-map-cheat-sheet.html' },
            { id: 'processes',    title: 'Processes',    meta: 'Stages & flow',          masterclass: 'ielts-process-diagram-masterclass.html', cheatsheet: 'ielts-process-cheat-sheet.html' },
            { id: 'tables',       title: 'Tables',       meta: 'Multi-variable',         masterclass: 'ielts-task1-table-masterclass.html',     cheatsheet: 'ielts-table-cheatsheet.html' },
          ],
        },
        { id: 'task2', title: 'Writing Task 2', meta: '40 min · 250 words', nodes: ['instruction', 'cheatsheet'] },
      ],
    },
    {
      id: 'grammar',
      title: 'Grammar',
      kicker: 'Structure Drills',
      tagline: 'Shadow-type academic grammar and Task 1 phrases until they feel automatic.',
      summary: 'Short-sentence drills. One sentence at a time — type it, see the grammar note, move on.',
      groups: [
        {
          id: 'grammar-structures',
          title: 'Grammar Structures',
          meta: '5 categories · 50 sentences',
          topics: [
            { id: 'conditionals',  title: 'Conditionals',    icon: '⚡', meta: 'Had / Were / Should inversions' },
            { id: 'passive',       title: 'Passive Voice',   icon: '🔄', meta: 'Complex passives & reporting verbs' },
            { id: 'inversion',     title: 'Inversion',       icon: '↩️', meta: 'Not only, Rarely, Never before' },
            { id: 'reported',      title: 'Reported Speech', icon: '💬', meta: 'Backshift & modal retention' },
            { id: 'cleft',         title: 'Cleft Sentences', icon: '✂️', meta: 'It is...that / What...is' },
          ],
        },
        {
          id: 'task1-phrases',
          title: 'Task 1 Phrases',
          meta: '9 categories · 90 sentences',
          topics: [
            { id: 'line-graphs',       title: 'Line Graphs',       icon: '📈', meta: 'Trend vocabulary' },
            { id: 'bar-charts',        title: 'Bar Charts',        icon: '📊', meta: 'Comparison language' },
            { id: 'pie-charts',        title: 'Pie Charts',        icon: '🥧', meta: 'Proportion language' },
            { id: 'maps',              title: 'Maps',              icon: '🗺️', meta: 'Spatial transformation' },
            { id: 'process-diagrams',  title: 'Processes',         icon: '⚙️', meta: 'Passive sequences' },
            { id: 'tables',            title: 'Tables',            icon: '📋', meta: 'Range & comparison' },
            { id: 'overviews',         title: 'Overviews',         icon: '📝', meta: 'Overview templates' },
            { id: 'discourse-markers', title: 'Discourse Markers', icon: '🔗', meta: 'Furthermore, Nevertheless' },
            { id: 'approximation',     title: 'Approximation',     icon: '≈',  meta: 'just under, roughly, well over' },
          ],
        },
      ],
    },
    {
      id: 'practice',
      title: 'Practice',
      kicker: 'Active Drill',
      tagline: 'Retype model answers under live correctness feedback. Reps build the muscle for exam day.',
      summary: 'Live typing drills. Choose a topic, type the model answer, watch your accuracy and WPM in real time.',
      groups: [
        {
          id: 'task1',
          title: 'Task 1',
          meta: 'Visual description',
          topics: [
            { id: 'line-graphs', title: 'Line Graphs', meta: 'Trends over time' },
            { id: 'bar-charts',  title: 'Bar Charts',  meta: 'Discrete comparison' },
            { id: 'pie-charts',  title: 'Pie Charts',  meta: 'Proportions' },
            { id: 'maps',        title: 'Maps',         meta: 'Spatial change' },
            { id: 'processes',   title: 'Processes',    meta: 'Stages & flow' },
            { id: 'tables',      title: 'Tables',       meta: 'Multi-variable' },
          ],
        },
        {
          id: 'task2',
          title: 'Task 2',
          meta: 'Argumentative essays',
          topics: [
            { id: 'opinion',               title: 'Opinion Essay',            meta: 'Agree / disagree' },
            { id: 'discussion',            title: 'Discussion',               meta: 'Both views + own' },
            { id: 'problem-solution',      title: 'Problem / Solution',       meta: 'Cause-effect' },
            { id: 'advantage-disadvantage',title: 'Advantages / Disadvantages',meta: 'Two-sided weigh-in' },
            { id: 'two-part',              title: 'Two-Part Question',        meta: 'Direct questions' },
          ],
        },
      ],
    },
  ],
};
"""

# ── Updated screens.jsx ──────────────────────────────────────────────────────
SCREENS_JSX = r"""
const { useEffect, useState, useMemo } = React;

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const on = () => setHash(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

function nav(path) {
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function Home() {
  const data = window.IELTS_DATA;
  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__eyebrow">
          <span className="home__eyebrow-dot" />
          IELTS Writing Trainer
        </div>
        <h1 className="home__title">
          Two disciplines.<br />
          One <em>examiner</em> standard.
        </h1>
        <p className="home__lede">
          Study the structure, then drill the muscle. <em className="lede-em lede-em--g">Guidebook</em> is the reference;
          <em className="lede-em lede-em--p"> Practice</em> is where the reps happen.
        </p>
      </div>

      <div className="home__cards">
        {data.domains.map((d) => (
          <a
            key={d.id}
            className="home-card"
            data-domain={d.id}
            href={`#/${d.id}`}
            onClick={(e) => { e.preventDefault(); nav(`/${d.id}`); }}
          >
            <div className="home-card__bg" />
            <div className="home-card__inner">
              <div className="home-card__top">
                <span className="eyebrow">{d.kicker}</span>
                <span className="home-card__index">{String(data.domains.indexOf(d) + 1).padStart(2, '0')} / {String(data.domains.length).padStart(2, '0')}</span>
              </div>
              <h2 className="home-card__name">
                {d.id === 'guidebook'
                  ? <><b>Guide</b>book<span className="dot">.</span></>
                  : d.id === 'grammar'
                  ? <><b>Gram</b>mar<span className="dot">.</span></>
                  : <><b>Prac</b>tice<span className="dot">.</span></>}
              </h2>
              <p className="home-card__tag">{d.tagline}</p>
              <div className="home-card__contents">
                <div className="home-card__contents-label">Contains</div>
                <ul className="home-card__list">
                  {d.groups.map((g) => (
                    <li key={g.id}>
                      <span className="home-card__bullet" />
                      <span>{g.title}</span>
                      <span className="home-card__meta">
                        {g.charts ? `${g.charts.length} chart types` : g.topics ? `${g.topics.length} topics` : g.meta}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="home-card__cta">
                Enter {d.title}
                <span className="arrow">&#8594;</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function DomainPage({ domainId }) {
  const data = window.IELTS_DATA;
  const domain = data.domains.find((d) => d.id === domainId);
  if (!domain) return <NotFound />;
  return (
    <div className="page" data-domain={domain.id}>
      <div className="section-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>{domain.kicker}</div>
          <h1>{domain.title}</h1>
          <p className="subtitle">{domain.summary}</p>
        </div>
        <div className="meta">{domain.groups.length} groups &middot; {countNodes(domain)} nodes</div>
      </div>
      <hr className="rule" />
      <div className="groups">
        {domain.groups.map((g) => <GroupRow key={g.id} domain={domain} group={g} />)}
      </div>
    </div>
  );
}

function countNodes(domain) {
  return domain.groups.reduce((acc, g) => {
    if (g.charts) return acc + g.charts.length;
    if (g.topics) return acc + g.topics.length;
    return acc + g.nodes.length;
  }, 0);
}

function GroupRow({ domain, group }) {
  const isCharts = !!group.charts;
  const isPractice = !!group.topics;
  const isFirstGroup = domain.groups.indexOf(group) === 0;
  const showStartHere = domain.id === 'guidebook' && isFirstGroup;
  return (
    <a
      className="group-card"
      href={`#/${domain.id}/${group.id}`}
      onClick={(e) => { e.preventDefault(); nav(`/${domain.id}/${group.id}`); }}
    >
      {showStartHere && <div className="gc-note">Start here</div>}
      <div className="gc-head">
        <div>
          <div className="gc-title">{group.title}</div>
          <div className="gc-meta" style={{ marginTop: 4 }}>{group.meta}</div>
        </div>
        <span className="gc-arrow">&#8594;</span>
      </div>
      <div className="gc-pills">
        {isCharts
          ? group.charts.map((c) => (
              <span key={c.id} className="pill"><span className="pill-dot" />{c.title}</span>
            ))
          : isPractice
          ? group.topics.map((t) => (
              <span key={t.id} className="pill"><span className="pill-dot" />{t.title}</span>
            ))
          : group.nodes.map((n) => (
              <span key={n} className={`badge badge--${n}`}>{n}</span>
            ))}
      </div>
    </a>
  );
}

function GroupPage({ domainId, groupId }) {
  const data = window.IELTS_DATA;
  const domain = data.domains.find((d) => d.id === domainId);
  const group = domain && domain.groups.find((g) => g.id === groupId);
  if (!domain || !group) return <NotFound />;
  const isCharts = !!group.charts;
  const isPractice = !!group.topics;
  return (
    <div className="page" data-domain={domain.id}>
      <div className="section-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>{domain.title} &middot; {group.meta}</div>
          <h1>{group.title}</h1>
          <p className="subtitle">
            {isCharts
              ? 'Six chart types. Each has a full Masterclass and an Exam-day Cheatsheet. Open them, then drill in Practice.'
              : isPractice
              ? 'Pick a visual type. Each topic uses a real exam-style prompt with a model answer to retype.'
              : 'Two reference modules. Read the Instruction once for theory; keep the Cheatsheet open while you practise.'}
          </p>
        </div>
        <div className="meta">
          {isCharts ? `${group.charts.length} chart types` : isPractice ? `${group.topics.length} topics` : `${group.nodes.length} nodes`}
        </div>
      </div>
      <hr className="rule" />
      {isCharts
        ? <ChartGrid domain={domain} group={group} />
        : isPractice
        ? <TopicGrid domain={domain} group={group} />
        : <NodeList domain={domain} group={group} />}
    </div>
  );
}

function ChartGrid({ domain, group }) {
  return (
    <div className="topic-grid">
      {group.charts.map((c, i) => (
        <a
          key={c.id}
          className="topic-card"
          href={`#/${domain.id}/${group.id}/${c.id}`}
          onClick={(e) => { e.preventDefault(); nav(`/${domain.id}/${group.id}/${c.id}`); }}
        >
          <div className="topic-card__num">{String(i + 1).padStart(2, '0')}</div>
          <div className="topic-card__body">
            <div className="topic-card__title">{c.title}</div>
            <div className="topic-card__meta">{c.meta}</div>
          </div>
          <span className="badge badge--instruction">Guide</span>
        </a>
      ))}
    </div>
  );
}

function NodeList({ domain, group }) {
  return (
    <div className="node-list">
      {group.nodes.map((nodeId) => {
        const isInstruction = nodeId === 'instruction';
        return (
          <a
            key={nodeId}
            className="node-card"
            href={`#/${domain.id}/${group.id}/${nodeId}`}
            onClick={(e) => { e.preventDefault(); nav(`/${domain.id}/${group.id}/${nodeId}`); }}
          >
            <div className="node-card__head">
              <span className={`badge badge--${nodeId}`}>{nodeId}</span>
              <span className="node-card__arrow">&#8594;</span>
            </div>
            <h3 className="node-card__title">
              {isInstruction ? 'Theory, structure, and what examiners want' : 'Phrases, vocab swaps, and ready templates'}
            </h3>
            <p className="node-card__body">
              {isInstruction
                ? 'Long-form module covering scoring criteria, time budget, and the anatomy of a band-7+ answer.'
                : 'Reference card: phrase banks by rhetorical function, formal synonym table, and adaptable templates.'}
            </p>
            <div className="node-card__foot">
              <span className="mono eyebrow">
                {isInstruction ? '4 sections · 7 checks · anatomy diagram' : '4 phrase blocks · vocab table · templates'}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}

function TopicGrid({ domain, group }) {
  return (
    <div className="topic-grid">
      {group.topics.map((t, i) => (
        <a
          key={t.id}
          className="topic-card"
          href={`#/${domain.id}/${group.id}/${t.id}`}
          onClick={(e) => { e.preventDefault(); nav(`/${domain.id}/${group.id}/${t.id}`); }}
        >
          <div className="topic-card__num">{String(i + 1).padStart(2, '0')}</div>
          <div className="topic-card__body">
            <div className="topic-card__title">{t.title}</div>
            <div className="topic-card__meta">{t.meta}</div>
          </div>
          <span className="badge badge--exercise">Exercise</span>
        </a>
      ))}
    </div>
  );
}

function NotFound() {
  return (
    <div className="page">
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 48 }}>Not found.</h1>
      <p>That route does not exist.</p>
      <button className="btn" onClick={() => nav('/')}>Back home</button>
    </div>
  );
}

Object.assign(window, { useHashRoute, nav, Home, DomainPage, GroupPage, NotFound });
"""

# ── Updated pages.jsx ────────────────────────────────────────────────────────
PAGES_JSX = r"""
const { useState: useStatePages } = React;

function InstructionPage({ domainId, groupId }) {
  const key = `${domainId}/${groupId}`;
  const data = window.INSTRUCTIONS[key];
  if (!data) return <NotFound />;
  return (
    <div className="page page--reading" data-domain={data.domain}>
      <div className="reading-head">
        <span className="badge badge--instruction">Instruction</span>
        <div className="eyebrow" style={{ marginTop: 18 }}>{data.eyebrow}</div>
        <h1 className="reading-title">{data.title}</h1>
        <p className="reading-deck">{data.deck}</p>
      </div>
      <hr className="rule" />
      <section className="article">
        <div className="article__label eyebrow">&#167; 01 &middot; Theory</div>
        <div className="article__body">
          {data.article.map((p, i) => (
            <div key={i} className="article__para">
              <h3 className="article__h">{p.h}</h3>
              <p className="article__p">{p.p}</p>
            </div>
          ))}
        </div>
      </section>
      <hr className="rule" />
      <section className="checklist-sec">
        <div className="article__label eyebrow">&#167; 02 &middot; Working Checklist</div>
        <ol className="checklist">
          {data.checklist.map((c, i) => (
            <li key={i} className="checklist__item">
              <span className="checklist__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="checklist__t">{c}</span>
            </li>
          ))}
        </ol>
      </section>
      <hr className="rule" />
      <section className="anatomy">
        <div className="article__label eyebrow">&#167; 03 &middot; {data.anatomy.label}</div>
        <div className="anatomy__grid">
          {data.anatomy.blocks.map((b, i) => (
            <div key={i} className="anatomy__row">
              <div className="anatomy__tag-col">
                <span className="anatomy__tag">{b.tag}</span>
              </div>
              <div className="anatomy__content">
                <p className="anatomy__body">{b.body}</p>
                <p className="anatomy__note">&#8627; {b.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="reading-foot">
        <button className="btn btn--ghost" onClick={() => nav(`/${domainId}/${groupId}/cheatsheet`)}>Open Cheatsheet</button>
        <button className="btn" onClick={() => nav(`/practice/${groupId === 'task1' ? 'task1' : 'task2'}`)}>
          Go practise {data.title} <span>&#8594;</span>
        </button>
      </div>
    </div>
  );
}

function CheatsheetPage({ domainId, groupId }) {
  const key = `${domainId}/${groupId}`;
  const data = window.CHEATSHEETS[key];
  if (!data) return <NotFound />;
  return (
    <div className="page page--reading" data-domain={data.domain}>
      <div className="reading-head">
        <span className="badge badge--cheatsheet">Cheatsheet</span>
        <div className="eyebrow" style={{ marginTop: 18 }}>{data.eyebrow}</div>
        <h1 className="reading-title">{data.title}</h1>
        <p className="reading-deck">{data.deck}</p>
      </div>
      <hr className="rule" />
      <section>
        <div className="article__label eyebrow">&#167; 01 &middot; Phrase Bank</div>
        <div className="phrase-grid">
          {data.phraseBlocks.map((b, i) => (
            <div key={i} className="phrase-block">
              <div className="phrase-block__label">{b.label}</div>
              <ul className="phrase-block__list">
                {b.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <hr className="rule" />
      <section>
        <div className="article__label eyebrow">&#167; 02 &middot; {data.vocabTable.label}</div>
        <table className="vocab">
          <thead><tr>{data.vocabTable.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
          <tbody>
            {data.vocabTable.rows.map((r, i) => (
              <tr key={i}>
                <td className="vocab__casual">{r[0]}</td>
                <td className="vocab__formal">{r[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <hr className="rule" />
      <section>
        <div className="article__label eyebrow">&#167; 03 &middot; Reusable Templates</div>
        <div className="templates">
          {data.templates.map((t, i) => (
            <div key={i} className="template">
              <div className="template__label">{t.label}</div>
              <p className="template__body">{renderTemplateSlots(t.body)}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="reading-foot">
        <button className="btn btn--ghost" onClick={() => nav(`/${domainId}/${groupId}/instruction`)}>Back to Instruction</button>
        <button className="btn" onClick={() => nav(`/practice/${groupId === 'task1' ? 'task1' : 'task2'}`)}>
          Apply in Practice <span>&#8594;</span>
        </button>
      </div>
    </div>
  );
}

function GuidebookChartPage({ groupId, chartId }) {
  const data = window.IELTS_DATA;
  const domain = data.domains.find((d) => d.id === 'guidebook');
  const group = domain && domain.groups.find((g) => g.id === groupId);
  const chart = group && group.charts && group.charts.find((c) => c.id === chartId);
  if (!chart) return <NotFound />;
  return (
    <div className="page page--reading" data-domain="guidebook">
      <div className="reading-head">
        <span className="badge badge--instruction">Guidebook</span>
        <div className="eyebrow" style={{ marginTop: 18 }}>Writing Task 1 &middot; {chart.title}</div>
        <h1 className="reading-title">{chart.title}</h1>
        <p className="reading-deck">Open the Masterclass to study theory and model answers, or pull up the Cheatsheet for exam-day reference. Then switch to Practice to drill the retype exercise.</p>
      </div>
      <hr className="rule" />
      <div className="node-list">
        <a className="node-card" href={chart.masterclass} target="_blank" rel="noopener noreferrer">
          <div className="node-card__head">
            <span className="badge badge--instruction">Masterclass</span>
            <span className="node-card__arrow">&#8599;</span>
          </div>
          <h3 className="node-card__title">Deep-dive theory and model answers</h3>
          <p className="node-card__body">Full instruction module covering structure, band descriptors, vocabulary, and annotated model answers for {chart.title.toLowerCase()}.</p>
          <div className="node-card__foot"><span className="mono eyebrow">Opens in new tab &middot; HTML file</span></div>
        </a>
        <a className="node-card" href={chart.cheatsheet} target="_blank" rel="noopener noreferrer">
          <div className="node-card__head">
            <span className="badge badge--cheatsheet">Cheatsheet</span>
            <span className="node-card__arrow">&#8599;</span>
          </div>
          <h3 className="node-card__title">Exam-day reference card</h3>
          <p className="node-card__body">Compact phrase bank, formal synonym table, and ready templates for {chart.title.toLowerCase()}. Keep open beside Practice.</p>
          <div className="node-card__foot"><span className="mono eyebrow">Opens in new tab &middot; HTML file</span></div>
        </a>
      </div>
      <div className="reading-foot">
        <button className="btn btn--ghost" onClick={() => nav('/guidebook/task1')}>&#8592; All chart types</button>
        <button className="btn" onClick={() => nav(`/practice/task1/${chartId}`)}>
          Practise {chart.title} <span>&#8594;</span>
        </button>
      </div>
    </div>
  );
}

function renderTemplateSlots(text) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((p, i) => {
    if (p.startsWith('[') && p.endsWith(']')) {
      return <span key={i} className="slot">{p.slice(1, -1)}</span>;
    }
    return <span key={i}>{p}</span>;
  });
}

Object.assign(window, { InstructionPage, CheatsheetPage, GuidebookChartPage });
"""

# ── Updated app.jsx routing ──────────────────────────────────────────────────
APP_JSX = r"""
const { useEffect: useEffectA, useState: useStateA, useMemo: useMemoA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "retype",
  "density": "comfortable",
  "dark": false
}/*EDITMODE-END*/;

function parseRoute(hash) {
  const parts = hash.replace(/^\//, '').split('/').filter(Boolean);
  return parts;
}

function App() {
  const hash = useHashRoute();
  const route = useMemoA(() => parseRoute(hash), [hash]);

  const initialTweaks = useMemoA(() => {
    const t = { ...TWEAK_DEFAULTS };
    try {
      const u = new URL(window.location.href);
      if (u.searchParams.get('density')) t.density = u.searchParams.get('density');
      if (u.searchParams.get('dark')) t.dark = u.searchParams.get('dark') === '1' || u.searchParams.get('dark') === 'true';
      if (u.searchParams.get('mode')) t.mode = u.searchParams.get('mode');
    } catch (e) {}
    return t;
  }, []);

  const [t, setTweak] = useTweaks(initialTweaks);

  useEffectA(() => {
    document.documentElement.dataset.density = t.density;
    document.documentElement.dataset.theme = t.dark ? 'dark' : 'light';
  }, [t.density, t.dark]);

  let screen;
  let chromeProps = { domainId: null };

  if (route.length === 0) {
    screen = <Home />;
  } else if (route.length === 1) {
    chromeProps.domainId = route[0];
    screen = <DomainPage domainId={route[0]} />;
  } else if (route.length === 2) {
    chromeProps.domainId = route[0];
    screen = <GroupPage domainId={route[0]} groupId={route[1]} />;
  } else if (route.length === 3) {
    chromeProps.domainId = route[0];
    if (route[0] === 'grammar') {
      screen = <GrammarDrillPage groupId={route[1]} categoryId={route[2]} mode={t.mode} />;
    } else if (route[0] === 'guidebook' && route[2] !== 'instruction' && route[2] !== 'cheatsheet') {
      screen = <GuidebookChartPage groupId={route[1]} chartId={route[2]} />;
    } else if (route[2] === 'instruction') {
      screen = <InstructionPage domainId={route[0]} groupId={route[1]} />;
    } else if (route[2] === 'cheatsheet') {
      screen = <CheatsheetPage domainId={route[0]} groupId={route[1]} />;
    } else {
      screen = <TypingPage domainId={route[0]} groupId={route[1]} topicId={route[2]} mode={t.mode} />;
    }
  } else {
    screen = <NotFound />;
  }

  return (
    <div className="app">
      <TopBar route={route} />
      <div className="shell">{screen}</div>
      <TweaksPanel>
        <TweakSection label="Typing exercise" />
        <TweakRadio label="Mode" value={t.mode} options={['retype', 'blanks', 'memory']}
                    onChange={(v) => setTweak('mode', v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density} options={['comfortable', 'compact']}
                    onChange={(v) => setTweak('density', v)} />
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak('dark', v)} />
      </TweaksPanel>
    </div>
  );
}

function TopBar({ route }) {
  const data = window.IELTS_DATA;
  const crumbs = [];
  if (route[0]) {
    const dom = data.domains.find((d) => d.id === route[0]);
    if (dom) crumbs.push({ label: dom.title, path: `/${dom.id}`, domain: dom.id });
  }
  if (route[0] && route[1]) {
    const dom = data.domains.find((d) => d.id === route[0]);
    const grp = dom && dom.groups.find((g) => g.id === route[1]);
    if (grp) crumbs.push({ label: grp.title, path: `/${route[0]}/${route[1]}`, domain: dom.id });
  }
  if (route[0] && route[1] && route[2]) {
    let label = route[2];
    if (label === 'instruction') label = 'Instruction';
    else if (label === 'cheatsheet') label = 'Cheatsheet';
    else {
      const dom = data.domains.find((d) => d.id === route[0]);
      const grp = dom && dom.groups.find((g) => g.id === route[1]);
      const items = grp && (grp.charts || grp.topics);
      const found = items && items.find((x) => x.id === route[2]);
      if (found) label = found.title;
    }
    crumbs.push({ label, path: null, domain: route[0] });
  }

  return (
    <div className="topbar" data-domain={route[0] || undefined}>
      <a className="wordmark" href="#/" onClick={(e) => { e.preventDefault(); nav('/'); }}>
        IELTS<span style={{ color: 'var(--ink-mute)', margin: '0 6px' }}>&middot;</span>Trainer
      </a>
      <nav className="crumbs">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && <span className="sep">/</span>}
              {c.path && !isLast
                ? <a href={`#${c.path}`} onClick={(e) => { e.preventDefault(); nav(c.path); }}>{c.label}</a>
                : <span className={isLast ? 'current' : ''}>{c.label}</span>}
            </React.Fragment>
          );
        })}
      </nav>
      <div className="right mono">
        {route.length === 0 ? 'Home' :
         route.length === 1 ? 'L1 · Domain' :
         route.length === 2 ? 'L2 · Group' :
         'L3 · Content'}
      </div>
    </div>
  );
}

const __mount = document.getElementById('root');
ReactDOM.createRoot(__mount).render(<App />);
"""

# ── Grammar categories data (140 sentences, 14 categories) ──────────────────
GRAMMAR_CATS_JS = r"""
window.GRAMMAR_CATEGORIES = [
  {
    id: 'conditionals', name: 'Conditionals', icon: '⚡',
    sentences: [
      { text: 'Had the government invested more in infrastructure, the transport crisis would have been averted.', grammar: 'Type 3 inverted conditional — "Had" replaces "If...had"; formal academic register' },
      { text: 'Were she to apply for the position, she would undoubtedly be selected.', grammar: 'Type 2 inverted conditional — "Were...to" replaces "If she were to"', band: 8 },
      { text: 'Should the data prove inconclusive, the researchers would need to conduct further trials.', grammar: 'Inverted "Should" conditional — expresses a realistic future possibility' },
      { text: 'Had it not been for the intervention of international organisations, the conflict might have escalated.', grammar: '"Had it not been for" — Type 3 counterfactual expressing a prevented outcome', band: 8 },
      { text: 'Were prices to fall significantly, consumer spending would inevitably rise.', grammar: '"Were...to" structure — formal hypothetical future, suitable for academic prose' },
      { text: 'Should the temperature continue to increase, coastal communities would face severe flooding.', grammar: '"Should" inversion — commonly used in policy documents and academic reports' },
      { text: 'Had the authorities acted sooner, the environmental damage could have been minimised.', grammar: 'Type 3 with modal "could have been" — expresses unrealised past possibility' },
      { text: 'Were the company to relocate, hundreds of jobs would be lost.', grammar: '"Were...to" — indicates a hypothetical future scenario with serious consequences' },
      { text: 'Should more funding be allocated to renewable energy, the transition from fossil fuels would accelerate.', grammar: 'Passive + inverted conditional — "should...be allocated" in formal writing', band: 7 },
      { text: 'Had stricter regulations been in place, the financial collapse might have been prevented.', grammar: 'Type 3 passive — "had...been in place" + modal perfect passive in result clause' },
    ],
  },
  {
    id: 'passive', name: 'Passive Voice', icon: '🔄',
    sentences: [
      { text: 'The legislation is expected to have been drafted by the end of the financial year.', grammar: 'Complex passive — "is expected to have been" combines present + perfect infinitive passive', band: 8 },
      { text: 'Significant progress has been made in reducing carbon emissions over the past decade.', grammar: 'Present perfect passive — focuses on result; agent omitted as unimportant' },
      { text: 'The report is believed to have been submitted without the required supporting evidence.', grammar: '"is believed to have been" — reporting verb passive with perfect infinitive', band: 8 },
      { text: 'Several recommendations were put forward by the committee but were subsequently rejected.', grammar: 'Double passive in one sentence — two passive verbs linked by "but"' },
      { text: 'The data collected over three decades has been used to formulate the new policy.', grammar: 'Reduced relative clause — "data collected" = "data that was collected"; present perfect passive main verb' },
      { text: 'The building is said to have been designed by one of the leading architects of the era.', grammar: '"is said to have been designed" — reporting passive + perfect infinitive passive' },
      { text: 'More than a thousand species are thought to be threatened by habitat destruction each year.', grammar: '"are thought to be" — present passive with simple infinitive' },
      { text: 'The agreement is understood to have been reached after months of difficult negotiations.', grammar: '"is understood to have been reached" — complex passive reporting structure', band: 7 },
      { text: 'Considerable resources have been devoted to understanding the long-term effects of urbanisation.', grammar: '"have been devoted to" + gerund — present perfect passive with prepositional complement' },
      { text: 'The findings are expected to be published in a peer-reviewed journal later this year.', grammar: '"are expected to be published" — future event expressed via passive reporting verb' },
    ],
  },
  {
    id: 'inversion', name: 'Inversion', icon: '↩️',
    sentences: [
      { text: 'Not only did the government fail to address the issue, but it also introduced counterproductive measures.', grammar: '"Not only...but also" — auxiliary "did" inverted before subject for emphasis', band: 7 },
      { text: 'Rarely has such a significant shift in public opinion been observed in so short a time.', grammar: '"Rarely" inversion — present perfect auxiliary "has" placed before subject', band: 7 },
      { text: 'Under no circumstances should personal data be shared without the explicit consent of the individual.', grammar: '"Under no circumstances" — negative adverbial triggers inversion of "should" before subject' },
      { text: 'No sooner had the legislation been passed than it was challenged in the courts.', grammar: '"No sooner...than" — past perfect inverted after opening negative adverbial' },
      { text: 'Only when the scale of the problem became apparent did officials take decisive action.', grammar: '"Only when" inversion — auxiliary "did" fronted in main clause after adverbial clause' },
      { text: 'Never before has the rate of technological change posed such a profound challenge to society.', grammar: '"Never before" — present perfect inverted for maximum rhetorical emphasis', band: 8 },
      { text: 'Seldom do economic growth and environmental protection advance simultaneously.', grammar: '"Seldom" inversion — auxiliary "do" fronted with compound subject following' },
      { text: 'Not until the final results were announced did investors regain confidence in the market.', grammar: '"Not until" inversion — emphasis on the delayed moment of change' },
      { text: 'So rapidly has the technology developed that regulators have struggled to keep pace.', grammar: '"So + adverb" inversion — "so rapidly has" triggers subject-auxiliary inversion + result clause', band: 8 },
      { text: 'Little did the researchers anticipate that their findings would generate such widespread controversy.', grammar: '"Little" inversion — "little did...anticipate" stresses the unexpectedness of the outcome' },
    ],
  },
  {
    id: 'reported', name: 'Reported Speech', icon: '💬',
    sentences: [
      { text: 'The minister announced that the proposed reforms would be implemented in stages over the following year.', grammar: 'Backshift: "will" → "would"; "next" → "the following" — standard reported speech shifts' },
      { text: 'Scientists warned that unless immediate action was taken, the damage would prove irreversible.', grammar: 'Reported conditional — "is taken" → "was taken"; "will prove" → "would prove"' },
      { text: 'The spokesperson confirmed that the investigation had been ongoing for several months.', grammar: 'Backshift to past perfect — "has been" → "had been" in reported speech' },
      { text: 'Analysts predicted that the economic recovery would take longer than had initially been anticipated.', grammar: 'Embedded past perfect passive in reported prediction — "had...been anticipated"', band: 8 },
      { text: 'The committee acknowledged that insufficient attention had been paid to the needs of rural communities.', grammar: 'Reported acknowledgement with past perfect passive — formal academic register' },
      { text: 'Critics argued that the policy had been poorly designed and was unlikely to achieve its stated objectives.', grammar: 'Two backshifted clauses — "has been designed" → "had been designed"; "is" → "was"' },
      { text: 'Researchers suggested that the findings should be interpreted with considerable caution.', grammar: '"Should" does not backshift — modal suggestion is retained unchanged in reported speech' },
      { text: 'The report concluded that further investment would be required if the targets were to be met.', grammar: 'Reported conclusion with embedded formal conditional — "were to be met"', band: 8 },
      { text: 'Officials stated that the negotiations had reached a critical stage and that a breakthrough was imminent.', grammar: 'Two parallel "that" clauses — same reporting verb governs both subordinate clauses' },
      { text: 'Experts cautioned that the technology, while promising, had yet to be tested at scale.', grammar: '"Had yet to be tested" — past perfect passive expressing an unfulfilled requirement' },
    ],
  },
  {
    id: 'cleft', name: 'Cleft Sentences', icon: '✂️',
    sentences: [
      { text: 'It is the lack of affordable housing that has driven many young people out of the city.', grammar: '"It is...that" cleft — focuses emphasis on "the lack of affordable housing" as the key cause' },
      { text: 'What the data clearly demonstrates is that inequality has widened significantly over the past two decades.', grammar: '"What...is" pseudo-cleft — noun clause subject + "is" + that-clause predicate', band: 8 },
      { text: 'It was not until the industrial revolution that the pace of urbanisation began to accelerate dramatically.', grammar: '"It was not until...that" cleft — emphasises the turning point in time' },
      { text: 'What the government has failed to recognise is the long-term cost of underinvesting in education.', grammar: '"What...is" pseudo-cleft — moves focus to the government\'s critical oversight', band: 7 },
      { text: 'It is through international cooperation that the most pressing environmental challenges can be addressed.', grammar: '"It is...that" cleft with prepositional phrase — emphasises the means or method', band: 8 },
      { text: 'What distinguishes this approach from previous attempts is its emphasis on community-led solutions.', grammar: '"What...is" cleft — subject is a "what" clause; predicate is a noun phrase' },
      { text: 'It is the wealthiest nations that bear the greatest responsibility for reducing carbon emissions.', grammar: '"It is...that" cleft — redirects focus to the agent bearing primary responsibility' },
      { text: 'What the research consistently shows is that early intervention yields the most significant long-term benefits.', grammar: '"What...is that" cleft — links a generalised finding to a specific conclusion' },
      { text: 'It was only after considerable public pressure that the authorities agreed to review the decision.', grammar: '"It was only...that" cleft — "only" adds restrictive emphasis to the triggering condition' },
      { text: 'What makes this period particularly significant is the unprecedented convergence of social and economic disruption.', grammar: '"What...is" cleft — "what makes" clause as subject + noun phrase as predicate' },
    ],
  },
  {
    id: 'line-graphs', name: 'Line Graphs', icon: '📈',
    sentences: [
      { text: 'The line graph illustrates the changes in energy consumption across five countries between 1990 and 2020.', grammar: 'Standard opening — "illustrates the changes in [topic] across [subjects] between [years]"' },
      { text: 'Overall, it is evident that oil usage experienced a dramatic surge, while renewable energy climbed steadily throughout the period.', grammar: 'Overview sentence — contrasts two trends using "while"; "dramatic surge" vs "climbed steadily"' },
      { text: 'France consistently outperformed Germany throughout the period, with the gap widening particularly after 2005.', grammar: '"consistently outperformed...throughout the period" — adverb + verb collocation for sustained comparison' },
      { text: 'Having peaked at 45 million in 2010, the figure subsequently plummeted to just 28 million by the end of the period.', grammar: 'Participle clause — "having peaked at" introduces a past high point before describing a decline', band: 7 },
      { text: 'The proportion of users accessing the internet via mobile devices rose exponentially from 2008 onwards.', grammar: '"rose exponentially from [year] onwards" — strong upward trend with a clear starting point' },
      { text: 'Both categories fluctuated considerably during the early years before levelling off at approximately 30% in 2015.', grammar: '"fluctuated considerably...before levelling off at" — two-phase trend in one sentence' },
      { text: 'By far the most striking feature is the sharp decline in coal consumption, which nearly halved over the two-decade period.', grammar: '"By far the most striking feature is" — strong superlative opener for highlighting a key trend', band: 8 },
      { text: 'The figures for urban and rural populations converged significantly, reaching an almost identical level by 2018.', grammar: '"converged significantly" — useful for describing two lines approaching each other' },
      { text: 'After remaining stable throughout most of the 1990s, sales began to climb steadily from 2001 onwards.', grammar: 'Adverbial opener — "After [verb+ing]" introduces a stable period before a change begins' },
      { text: 'In contrast to the UK, where usage dropped significantly, Germany witnessed a sharp increase over the same period.', grammar: '"In contrast to [X], where [change], [Y] witnessed" — embedded relative clause for direct contrast', band: 7 },
    ],
  },
  {
    id: 'bar-charts', name: 'Bar Charts', icon: '📊',
    sentences: [
      { text: 'The bar chart compares the proportion of household income spent on food and leisure across six European countries in 2019.', grammar: 'Standard opening — "compares [what is measured] across [categories] in [year]"' },
      { text: 'Overall, the United Kingdom recorded the highest figure by a considerable margin, while Poland showed the lowest across all categories.', grammar: 'Overview — "by a considerable margin" strengthens the superlative; "across all categories" generalises the finding' },
      { text: 'At 45%, transport costs in Japan significantly outstripped those in all other countries surveyed.', grammar: '"outstripped those in all other countries surveyed" — strong comparison collocation; figure leads the sentence', band: 7 },
      { text: 'Healthcare spending in the United States dwarfed all other categories, standing at approximately three times the global average.', grammar: '"dwarfed all other categories" — vivid verb for dominance; "standing at" introduces the supporting figure', band: 8 },
      { text: 'While the figures for Germany and France exhibit a marginal difference, both countries considerably outpace their eastern European counterparts.', grammar: '"exhibit a marginal difference" — for near-equal bars; "outpace their counterparts" for group comparison' },
      { text: 'The proportion allocated to education ranked highest in South Korea, accounting for the largest share at nearly 18%.', grammar: '"ranked highest in [country], accounting for the largest share at [figure]" — two-part description of a top bar' },
      { text: 'There is a stark contrast between developed and developing nations, with the former spending nearly double the latter on infrastructure.', grammar: '"stark contrast...with the former...the latter" — formal comparison using "former/latter" avoids repetition', band: 7 },
      { text: 'With the exception of Japan, all countries surveyed showed a broadly similar pattern of expenditure across the five categories.', grammar: '"With the exception of [X], all [subjects] showed a broadly similar pattern" — generalisation with one outlier' },
      { text: 'Technology exports from China more than doubled between 2010 and 2020, causing it to overtake the United States for the first time.', grammar: '"more than doubled...causing it to overtake" — cause-and-effect structure linking a trend to its consequence' },
      { text: 'The gap between the highest and lowest performing nations was particularly pronounced in the healthcare and education sectors.', grammar: '"the gap...was particularly pronounced in" — highlights where a disparity is most significant' },
    ],
  },
  {
    id: 'pie-charts', name: 'Pie Charts', icon: '🥧',
    sentences: [
      { text: 'The pie charts illustrate the breakdown of household energy consumption in Germany in 1990 and 2020.', grammar: 'Standard opening — "illustrate the breakdown of [topic] in [place] in [years]"' },
      { text: 'Overall, heating accounted for the largest proportion in both years, while electricity constituted the smallest share.', grammar: 'Overview — "accounted for the largest proportion" vs "constituted the smallest share" for two extremes' },
      { text: "Transport claimed the lion's share of government expenditure, accounting for well over a third of the total budget.", grammar: '"claimed the lion\'s share" — idiomatic phrase for dominant category; "well over a third" avoids exact figures', band: 8 },
      { text: 'Food and clothing collectively accounted for approximately two-fifths of total household spending in the base year.', grammar: '"collectively accounted for approximately two-fifths" — groups categories together using a fraction' },
      { text: 'At a mere 4%, expenditure on culture and recreation remained only a fraction of that spent on housing.', grammar: '"At a mere [%]" — "mere" emphasises smallness; "only a fraction of" compares proportionally' },
      { text: 'The distribution is heavily skewed towards service industries, which jointly represented over 60% of the national economy.', grammar: '"heavily skewed towards" — strong descriptor for uneven distribution; "jointly represented" groups subcategories', band: 7 },
      { text: 'Manufacturing and agriculture, comprising approximately 15% and 8% respectively, saw their combined share decline sharply by 2020.', grammar: '"comprising [X]% and [Y]% respectively" — precise multi-item description using a single relative clause' },
      { text: 'The share attributed to renewable energy was more than double that recorded a decade earlier, rising from 12% to 25%.', grammar: '"more than double that recorded" — elegant comparative without repeating the noun; "rising from X to Y" adds precision' },
      { text: 'With the notable exception of Asia, all other regions showed a broadly comparable distribution of trade activity.', grammar: '"With the notable exception of" — stronger than "except for"; signals an outlier before a generalisation' },
      { text: 'Spending on defence, at approximately one-fifth of the total, considerably outweighed investment in social welfare programmes.', grammar: 'Parenthetical figure — ", at approximately one-fifth," embedded mid-sentence for fluency' },
    ],
  },
  {
    id: 'maps', name: 'Maps', icon: '🗺️',
    sentences: [
      { text: 'The maps illustrate how the coastal town of Bradfield has transformed over a fifty-year period from 1970 to 2020.', grammar: 'Standard opening — "illustrate how [place] has transformed over [period] from [year] to [year]"' },
      { text: 'Overall, the area underwent substantial development, with the farmland to the north being replaced by a residential zone.', grammar: 'Overview — "underwent substantial development" is the main claim; "with [noun] being replaced" adds supporting detail', band: 7 },
      { text: 'The factory situated in the northern corner was demolished and replaced by a modern shopping centre.', grammar: '"situated in the [direction] corner was demolished and replaced by" — location + transformation in one sentence' },
      { text: 'A dual carriageway running through the centre of town was constructed, significantly improving connectivity across the region.', grammar: 'Participial phrase — "running through" locates the road; "significantly improving" shows the result' },
      { text: 'The woodland adjacent to the river was removed to make way for a new leisure complex and car park.', grammar: '"adjacent to [feature] was removed to make way for" — reason clause explains the demolition' },
      { text: 'The school building, originally located opposite the town hall, was extended considerably during the later period.', grammar: 'Embedded clause — ", originally located opposite [landmark]," gives prior position before describing the change' },
      { text: 'Several residential properties on both sides of the main road were converted into commercial premises between 1990 and 2020.', grammar: '"on both sides of" — useful spatial phrase; "converted into" for change of use rather than demolition' },
      { text: 'The harbour, which had previously remained unchanged since its construction, was expanded and upgraded during the later period.', grammar: '"which had previously remained unchanged since its construction" — relative clause contrasts past stability with present change', band: 8 },
      { text: 'A pedestrian walkway was developed along the northern bank, connecting the old town to the newly built cultural centre.', grammar: '"developed along the [direction] bank, connecting" — location + participial result clause' },
      { text: 'The industrial zone to the east of the railway line was relocated and transformed into a public park and recreation area.', grammar: '"to the east of the railway line was relocated and transformed into" — compass direction + double transformation verb' },
    ],
  },
  {
    id: 'process-diagrams', name: 'Processes', icon: '⚙️',
    sentences: [
      { text: 'The diagram illustrates the process by which raw coffee beans are transformed into the finished product ready for retail sale.', grammar: 'Standard opening — "illustrates the process by which [input] is transformed into [output]"' },
      { text: 'Overall, the process comprises seven distinct stages, commencing with the harvesting of ripe berries and culminating in packaging.', grammar: 'Overview — "comprises [N] distinct stages, commencing with...and culminating in" covers start to finish in one sentence' },
      { text: 'Once the outer casing has been removed, the beans are subjected to a thorough washing process to eliminate impurities.', grammar: '"Once [present perfect passive], [subject] is subjected to" — temporal clause + complex passive for sequential steps' },
      { text: 'In the penultimate stage, the dried beans undergo roasting at temperatures exceeding 200 degrees, thereby altering their chemical composition.', grammar: '"In the penultimate stage...undergo...thereby [verb+ing]" — position marker + cause-and-effect ending', band: 8 },
      { text: 'Prior to fermentation, the harvested grapes are passed through a mechanical press to extract the juice from the pulp.', grammar: '"Prior to [noun], [subject] is passed through" — formal temporal preposition for ordering steps' },
      { text: 'The mixture is then transferred to a series of heated chambers, where it is left to mature for a minimum of six weeks.', grammar: '"transferred to...where it is left to [verb] for" — movement + duration embedded in a relative clause' },
      { text: 'At this juncture, the material is meticulously inspected for defects before being passed on to the next stage of production.', grammar: '"At this juncture" — formal discourse marker; "meticulously inspected" raises register', band: 8 },
      { text: 'The recycled material is converted into small pellets, which are subsequently melted and moulded into new plastic containers.', grammar: '"converted into...which are subsequently melted and moulded" — two-step chain using a relative clause' },
      { text: 'The water is first filtered to remove solid particles, then treated with chemicals to eliminate any remaining bacterial contamination.', grammar: '"first...then" — simplest sequencing pair; two parallel passive infinitive clauses' },
      { text: 'Once processing is complete, the final product is packaged, labelled, and dispatched to distribution centres across the country.', grammar: '"Once [noun] is complete, [subject] is [verb], [verb], and [verb]" — three-verb passive list for the final stage' },
    ],
  },
  {
    id: 'tables', name: 'Tables', icon: '📋',
    sentences: [
      { text: 'The table compares five countries across four socioeconomic indicators: GDP per capita, life expectancy, literacy rate, and unemployment.', grammar: 'Standard opening — "compares [N] [subjects] across [N] indicators:" followed by a colon-introduced list' },
      { text: 'Overall, Japan ranks highest in life expectancy and literacy, while Brazil records the lowest figures across most indicators.', grammar: 'Overview — two extremes named explicitly; "across most indicators" avoids overstating a universal claim' },
      { text: 'Norway consistently outperforms all other nations, with its GDP per capita standing at approximately twice the global average.', grammar: '"consistently outperforms all other nations" — strong superlative; "standing at approximately twice" adds a ratio' },
      { text: 'The figures for literacy rate range from a high of 99% in South Korea to a low of 61% in Nigeria.', grammar: '"range from a high of [X] in [place] to a low of [Y] in [place]" — standard formula for showing spread', band: 7 },
      { text: 'There is a marked disparity between developed and developing nations, particularly in the areas of healthcare spending and educational attainment.', grammar: '"marked disparity between...particularly in the areas of" — general claim followed by specific sectors' },
      { text: 'With the exception of China, all Asian economies surveyed show a comparable level of export activity relative to GDP.', grammar: '"With the exception of [X], all [group] show a comparable level of [metric] relative to [benchmark]"' },
      { text: 'Germany presents a striking contrast to its European neighbours, recording both the highest trade surplus and the lowest unemployment rate.', grammar: '"presents a striking contrast...recording both the highest...and the lowest" — double superlative for emphasis' },
      { text: 'Life expectancy in the United States, at 78 years, lags considerably behind that of Japan, which stands at 84 years.', grammar: 'Parenthetical figure — ", at [N] years," mid-sentence; "lags considerably behind that of" for a precise comparison' },
      { text: 'The data reveals that countries with higher literacy rates consistently outperform those with lower rates in terms of economic productivity.', grammar: '"The data reveals that...consistently outperform those with lower rates in terms of" — analytical conclusion sentence' },
      { text: 'Australia stands out as a notable outlier, achieving high scores across all four categories despite its relatively small population.', grammar: '"stands out as a notable outlier, achieving...despite" — concessive clause highlights an unexpected result', band: 7 },
    ],
  },
  {
    id: 'overviews', name: 'Overviews', icon: '📝',
    sentences: [
      { text: 'Overall, it is clear that renewable energy experienced the most significant growth, while coal consumption declined steadily throughout the period.', grammar: '"Overall, it is clear that [X], while [Y]" — standard two-trend overview for line graphs', band: 7 },
      { text: 'In general, the proportion of spending on healthcare rose considerably, whereas education funding declined over the same timeframe.', grammar: '"In general...rose considerably, whereas...declined" — contrasting overview using "whereas"', band: 7 },
      { text: 'Overall, the area underwent substantial transformation, with industrial land being replaced by residential zones, while the town centre remained largely unchanged.', grammar: '"Overall, the area underwent substantial transformation, with [X] being replaced, while [Y] remained" — map overview template', band: 7 },
      { text: 'In summary, the wealthiest nations consistently recorded the highest figures across all indicators, with the gap between the highest and lowest widening over time.', grammar: '"In summary, [group] consistently recorded the highest figures across all indicators" — table overview formula', band: 8 },
      { text: 'Overall, it is evident that the two countries followed markedly different trajectories, with one peaking early while the other rose steadily throughout.', grammar: '"markedly different trajectories" — strong comparative language for diverging trends', band: 7 },
      { text: 'In general, manufacturing accounted for the dominant share in the earlier period, whereas services had become the largest sector by the end.', grammar: '"accounted for the dominant share...whereas [X] had become" — temporal shift in proportions for pie charts', band: 7 },
      { text: 'Overall, the process is relatively straightforward, comprising six distinct stages from the initial raw material through to the finished consumer product.', grammar: '"comprising [N] distinct stages from [start] through to [end]" — process diagram overview', band: 7 },
      { text: 'In summary, younger age groups represented the largest proportion of internet users, while those aged over 65 accounted for the smallest share.', grammar: '"represented the largest proportion...while [group] accounted for the smallest share" — bar/pie chart overview', band: 7 },
      { text: 'Overall, there is a clear correlation between levels of urbanisation and economic output, with more developed nations consistently outperforming their counterparts.', grammar: '"a clear correlation between [X] and [Y]" — analytical overview language for table/chart comparisons', band: 8 },
      { text: 'In general, both cities underwent considerable expansion, though the nature of development differed significantly between the northern and southern districts.', grammar: '"underwent considerable expansion, though the nature of development differed" — overview conceding similarity while noting divergence', band: 7 },
    ],
  },
  {
    id: 'discourse-markers', name: 'Discourse Markers', icon: '🔗',
    sentences: [
      { text: 'Furthermore, the data suggests that investment in renewable energy more than doubled over the course of the decade.', grammar: '"Furthermore" — additive marker introducing a supporting point; stronger than "also"', band: 7 },
      { text: 'Nevertheless, it should be noted that these figures represent only a small fraction of total global expenditure.', grammar: '"Nevertheless" — concessive marker; acknowledges the main trend before qualifying it', band: 7 },
      { text: 'In spite of this general upward trend, the figures for Japan remained consistently high throughout the entire period.', grammar: '"In spite of this [noun/adjective]" — prepositional concessive; introduces an exception to the pattern', band: 7 },
      { text: 'As a consequence, the overall proportion of urban dwellers surpassed that of rural residents for the first time in recorded history.', grammar: '"As a consequence" — causal marker; shows result of a previously described change', band: 7 },
      { text: 'In addition to this, the proportion allocated to transport infrastructure increased by approximately 15 percentage points between 2000 and 2020.', grammar: '"In addition to this" — additive marker; more formal than "also" or "and"', band: 7 },
      { text: 'By contrast, the southern region experienced a marked decline, falling from 45% to just 28% over the same period.', grammar: '"By contrast" — direct comparison marker; introduces the opposite trend', band: 7 },
      { text: 'Despite the overall growth trend, there were notable fluctuations during the middle years, particularly between 2008 and 2012.', grammar: '"Despite [noun phrase]" — concessive preposition; no comma needed before the main clause', band: 7 },
      { text: 'Moreover, countries with higher levels of educational attainment consistently demonstrated stronger economic performance across all measured indicators.', grammar: '"Moreover" — additive emphatic; stronger than "furthermore"; introduces a particularly important point', band: 8 },
      { text: 'On the other hand, developing nations showed a significantly different pattern, with expenditure on food comprising the largest proportion of household budgets.', grammar: '"On the other hand" — contrastive marker; used for direct comparison between two groups', band: 7 },
      { text: 'As a result of this rapid urbanisation, green spaces in the town centre were almost entirely replaced by commercial and residential buildings.', grammar: '"As a result of [noun phrase]" — causal connector; note the noun phrase (not a clause) after "of"', band: 7 },
    ],
  },
  {
    id: 'approximation', name: 'Approximation', icon: '≈',
    sentences: [
      { text: 'The proportion rose to just under 40%, while the corresponding figure for the previous year stood at roughly 25%.', grammar: '"just under [X]%" and "roughly [Y]%" — two hedging expressions in one sentence for contrast', band: 7 },
      { text: 'At approximately 3.5 million, the figure was slightly more than double that recorded at the start of the period.', grammar: '"At approximately [X]" opens the sentence; "slightly more than double" is a hedged ratio', band: 7 },
      { text: 'Spending on healthcare accounted for around one-third of the total budget, compared to a mere 8% allocated to education.', grammar: '"around one-third" — fraction with hedging; "a mere 8%" uses "mere" to stress smallness', band: 7 },
      { text: 'The two figures were broadly comparable, with the UK standing at just over 35% and France recording approximately 33%.', grammar: '"broadly comparable" — hedged equivalence; "just over" and "approximately" prevent over-precision', band: 7 },
      { text: 'By 2020, the number had fallen to nearly half its peak value, settling at around 12 million units per year.', grammar: '"nearly half its peak value" — ratio expressed without repeating the original figure', band: 7 },
      { text: 'The gap between the highest and lowest categories narrowed considerably, from roughly 30 percentage points to just under 10.', grammar: '"from roughly [X] to just under [Y]" — hedged range to describe a narrowing gap', band: 7 },
      { text: 'Coal consumption, at well over 40% in 1990, had declined to a little more than 15% by the end of the period.', grammar: '"well over [X]" for clearly exceeding a round number; "a little more than [Y]" for just above', band: 7 },
      { text: 'The figures for Germany and Japan were almost identical, both standing at somewhere in the region of 2.8 million.', grammar: '"somewhere in the region of" — highly hedged; used when precision would imply false accuracy', band: 7 },
      { text: 'In the final year, the proportion had recovered to approximately its 2005 level, hovering at around 22% of the total.', grammar: '"hovering at around [X]%" — "hovering" implies instability near a figure', band: 7 },
      { text: 'Sales of electric vehicles grew from a negligible fraction in 2010 to account for roughly one-fifth of all new car purchases by 2022.', grammar: '"a negligible fraction" for near-zero starting point; "roughly one-fifth" for the end fraction', band: 8 },
    ],
  },
];
"""

# ── GrammarDrillPage component ────────────────────────────────────────────────
GRAMMAR_DRILL_JSX = r"""
const { useState: useStateGD, useCallback: useCallbackGD, useEffect: useEffectGD } = React;

function BandBadge({ band }) {
  if (!band) return null;
  return (
    <span className={`band-badge band-badge--b${band}`}>B{band}</span>
  );
}

function GrammarDrillPage({ groupId, categoryId, mode }) {
  const cat = window.GRAMMAR_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return <NotFound />;

  const sentences = cat.sentences;
  const total = sentences.length;

  const [idx, setIdx] = useStateGD(0);
  const [done, setDone] = useStateGD(false);
  const [resetKey, setResetKey] = useStateGD(0);
  const [stats, setStats] = useStateGD({ wpm: 0, acc: 100, elapsedMs: 0, progress: 0 });
  const [advancing, setAdvancing] = useStateGD(false);

  const sentence = sentences[Math.min(idx, total - 1)];

  const handleComplete = useCallbackGD((s) => {
    setStats(s);
    if (idx >= total - 1) {
      setDone(true);
      return;
    }
    setAdvancing(true);
    setTimeout(() => {
      setIdx((i) => i + 1);
      setResetKey((k) => k + 1);
      setAdvancing(false);
    }, 700);
  }, [idx, total]);

  function restart() {
    setIdx(0);
    setDone(false);
    setResetKey((k) => k + 1);
    setAdvancing(false);
    setStats({ wpm: 0, acc: 100, elapsedMs: 0, progress: 0 });
  }

  if (done) {
    return (
      <div className="page page--typing" data-domain="grammar">
        <div className="reading-head">
          <span className="badge badge--exercise">Complete</span>
          <div className="eyebrow" style={{ marginTop: 18 }}>{cat.icon} {cat.name}</div>
          <h1 className="reading-title">All {total} sentences done.</h1>
        </div>
        <div className="typing-done">
          <div className="typing-done__row">
            <div><span className="typing-done__big">{stats.wpm.toFixed(0)}</span> wpm</div>
            <div><span className="typing-done__big">{stats.acc.toFixed(0)}%</span> accuracy</div>
            <div><span className="typing-done__big">{fmtTime(stats.elapsedMs)}</span> time</div>
          </div>
          <div className="typing-done__actions">
            <button className="btn btn--ghost" onClick={restart}>↻ Restart</button>
            <button className="btn" onClick={() => nav(`/grammar/${groupId}`)}>Back to group →</button>
          </div>
        </div>
      </div>
    );
  }

  const activeMode = mode || 'retype';
  const overallProgress = (idx / total) * 100;

  return (
    <div className={`page page--typing${advancing ? ' page--advancing' : ''}`} data-domain="grammar">
      <div className="reading-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="badge badge--exercise">{cat.icon} {cat.name}</span>
          <BandBadge band={sentence.band} />
        </div>
        <div className="eyebrow" style={{ marginTop: 14 }}>
          Sentence {idx + 1} / {total}
        </div>
        <p className="reading-deck" style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)', lineHeight: 1.65, marginTop: 10 }}>
          {sentence.text}
        </p>
      </div>

      <div className="typing-main" style={{ maxWidth: 820, marginTop: 0 }}>
        <div className="typing-stats">
          <Stat label="WPM" value={stats.wpm.toFixed(0)} />
          <Stat label="Accuracy" value={`${stats.acc.toFixed(0)}%`} />
          <Stat label="Done" value={`${idx} / ${total}`} />
          <button
            className="btn btn--ghost typing-reset"
            onClick={() => { setResetKey((k) => k + 1); setStats({ wpm: 0, acc: 100, elapsedMs: 0, progress: 0 }); }}
          >↻ Restart sentence</button>
        </div>

        <div className="typing-progressbar">
          <div className="typing-progressbar__fill" style={{ width: `${overallProgress}%` }} />
        </div>

        <div className="typing-mode-strip">
          <span className="eyebrow">Mode</span>
          <span className="typing-mode-strip__value">
            {activeMode === 'retype' && 'Retype · live correctness feedback'}
            {activeMode === 'blanks' && 'Fill in the blanks · type only the missing words'}
            {activeMode === 'memory' && 'Memory · type from memory'}
          </span>
          <span className="typing-mode-strip__hint mono">Cycle in Tweaks ↘</span>
        </div>

        <TypingCanvas
          key={`gd-${categoryId}-${idx}-${resetKey}`}
          source={sentence.text}
          mode={activeMode}
          onProgress={setStats}
          onComplete={handleComplete}
        />

        {sentence.grammar && (
          <div style={{ marginTop: 20, padding: '14px 18px', background: 'var(--d-soft, rgba(0,0,0,0.04))', borderRadius: 8, borderLeft: '3px solid var(--d-color, var(--ink-mute))' }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Grammar note</div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '0.83rem', color: 'var(--ink-mute)', lineHeight: 1.6, margin: 0 }}>
              {sentence.grammar}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { GrammarDrillPage });
"""

# ── Build the HTML ─────────────────────────────────────────────────────────
grammar_css = """
[data-domain="grammar"] {
  --d-color: var(--practice);
  --d-soft: var(--practice-soft);
  --d-mid: var(--practice-mid);
  --d-ink: var(--practice-ink);
  --d-fill: var(--practice-fill);
  --d-glow: var(--practice-glow);
}
.band-badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px; font-family: var(--mono); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; }
.band-badge--b6 { background: #fef3c7; color: #92400e; }
.band-badge--b7 { background: #ede9fe; color: #5b21b6; }
.band-badge--b8 { background: #d1fae5; color: #065f46; }
[data-theme="dark"] .band-badge--b6 { background: #451a03; color: #fde68a; }
[data-theme="dark"] .band-badge--b7 { background: #2e1065; color: #c4b5fd; }
[data-theme="dark"] .band-badge--b8 { background: #022c22; color: #6ee7b7; }
.page--advancing { opacity: 0.6; transition: opacity 0.15s; }
"""
css = read('styles.css') + '\n' + read('styles-components.css') + '\n' + grammar_css
tweaks = read('tweaks-panel.jsx')
typing = read('typing.jsx')
instructions_and_cheatsheets = read('data.js')
# Extract just INSTRUCTIONS and CHEATSHEETS blocks from data.js (not IELTS_DATA)
# We replace IELTS_DATA with our updated version but keep INSTRUCTIONS, CHEATSHEETS, EXERCISES
# Strip window.IELTS_DATA block from data.js
data_without_ielts = re.sub(
    r'window\.IELTS_DATA\s*=\s*\{.*?\};\s*\n',
    '',
    instructions_and_cheatsheets,
    flags=re.DOTALL
)

html = f"""<!doctype html>
<html lang="en" data-density="comfortable" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>IELTS Writing Trainer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
{css}
  </style>
</head>
<body>
  <div id="root"></div>

  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <script>
{DATA_JS}
{data_without_ielts}
{GRAMMAR_CATS_JS}
  </script>

  <script type="text/babel">
{tweaks}
  </script>

  <script type="text/babel">
{SCREENS_JSX}
  </script>

  <script type="text/babel">
{PAGES_JSX}
  </script>

  <script type="text/babel">
{GRAMMAR_DRILL_JSX}
  </script>

  <script type="text/babel">
{typing}
  </script>

  <script type="text/babel">
{APP_JSX}
  </script>
</body>
</html>
"""

out = os.path.join(BASE, 'ielts-grammar-trainer.html')
with open(out, 'w', encoding='utf-8') as f:
    f.write(html)

kb = len(html.encode('utf-8')) // 1024
print(f"Done -> ielts-grammar-trainer.html ({kb} KB)")
