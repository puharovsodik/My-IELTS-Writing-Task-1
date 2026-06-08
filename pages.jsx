// pages.jsx — Instruction + Cheatsheet L3 content pages

const { useState: useStatePages } = React;

// ─────────────────────────────────────────────────────────────────────────────
// Instruction page — mix of article, checklist, anatomy
// ─────────────────────────────────────────────────────────────────────────────
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

      {/* ── Article ── */}
      <section className="article">
        <div className="article__label eyebrow">§ 01 · Theory</div>
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

      {/* ── Checklist ── */}
      <section className="checklist-sec">
        <div className="article__label eyebrow">§ 02 · Working Checklist</div>
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

      {/* ── Anatomy ── */}
      <section className="anatomy">
        <div className="article__label eyebrow">§ 03 · {data.anatomy.label}</div>
        <div className="anatomy__grid">
          {data.anatomy.blocks.map((b, i) => (
            <div key={i} className="anatomy__row">
              <div className="anatomy__tag-col">
                <span className="anatomy__tag">{b.tag}</span>
                <span className="anatomy__line" />
              </div>
              <div className="anatomy__content">
                <p className="anatomy__body">{b.body}</p>
                <p className="anatomy__note">↳ {b.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="reading-foot">
        <button
          className="btn btn--ghost"
          onClick={() => nav(`/${domainId}/${groupId}/cheatsheet`)}
        >
          Open Cheatsheet
        </button>
        <button
          className="btn"
          onClick={() => nav(`/practice/${groupId === 'task1' ? 'task1' : 'task2'}`)}
        >
          Go practise {data.title}
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cheatsheet page — phrase blocks + vocab + templates
// ─────────────────────────────────────────────────────────────────────────────
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

      {/* ── Phrase blocks ── */}
      <section>
        <div className="article__label eyebrow">§ 01 · Phrase Bank</div>
        <div className="phrase-grid">
          {data.phraseBlocks.map((b, i) => (
            <div key={i} className="phrase-block">
              <div className="phrase-block__label">{b.label}</div>
              <ul className="phrase-block__list">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule" />

      {/* ── Vocab table ── */}
      <section>
        <div className="article__label eyebrow">§ 02 · {data.vocabTable.label}</div>
        <table className="vocab">
          <thead>
            <tr>
              {data.vocabTable.headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
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

      {/* ── Templates ── */}
      <section>
        <div className="article__label eyebrow">§ 03 · Reusable Templates</div>
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
        <button
          className="btn btn--ghost"
          onClick={() => nav(`/${domainId}/${groupId}/instruction`)}
        >
          Back to Instruction
        </button>
        <button
          className="btn"
          onClick={() => nav(`/practice/${groupId === 'task1' ? 'task1' : 'task2'}`)}
        >
          Apply in Practice
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

function ModelSentence({ label, parts, note }) {
  return (
    <div className="model-sentence">
      {label && <div className="model-sentence__label">{label}</div>}
      <p className="model-sentence__text">
        {parts.map((p, i) => (
          <React.Fragment key={i}>
            {i > 0 && ' '}
            <span className={p.role ? `role-${p.role}` : undefined}>{p.text}</span>
          </React.Fragment>
        ))}
      </p>
      {note && <p className="model-sentence__note">{note}</p>}
    </div>
  );
}

function GuidePage({ domainId, groupId, topicId }) {
  const key = `${domainId}/${groupId}/${topicId}`;
  const guide = window.GUIDES[key];
  const data = window.IELTS_DATA;
  const dom = data.domains.find(d => d.id === domainId);
  const grp = dom.groups.find(g => g.id === groupId);
  const topic = grp.guideSections[0].topics.find(t => t.id === topicId);

  if (!guide) return <NotFound />;

  return (
    <div className="page page--reading">
      <div className="reading-head">
        <span className="badge badge--instruction">{guide.eyebrow}</span>
        <h1 className="reading-title">{guide.title}</h1>
      </div>
      <p className="article">{guide.deck}</p>

      {guide.sections.map((section, i) => (
        <section key={i} className="reading-section">
          <h2>{section.title}</h2>
          {section.intro && <p className="article">{section.intro}</p>}
          {section.template && (
            <div className="template">
              <p className="template__body">{renderTemplateSlots(section.template)}</p>
            </div>
          )}
          {section.sentences.map((s, j) => (
            <ModelSentence key={j} label={s.label} parts={s.parts} note={s.note} />
          ))}
          {section.callouts && section.callouts.map((c, k) => (
            <div key={k} className={`callout callout--${c.type}`}>
              <div className="callout__title">{c.title}</div>
              <ul className="callout__list">
                {c.items.map((item, m) => <li key={m}>{item}</li>)}
              </ul>
            </div>
          ))}
        </section>
      ))}

      <section className="reading-section">
        <h2>Checklist</h2>
        <ul className="checklist">
          {guide.checklist.map((item, i) => (
            <li key={i} className="checklist__item">{item}</li>
          ))}
        </ul>
      </section>

      <div className="reading-foot">
        <a
          className="btn"
          href={`#/${domainId}/${groupId}/cheatsheet/${topicId}`}
          onClick={e => { e.preventDefault(); nav(`/${domainId}/${groupId}/cheatsheet/${topicId}`); }}
        >
          Open Cheatsheet
        </a>
        <a
          className="btn btn--primary"
          href={`#/practice/${groupId}/${topicId}`}
          onClick={e => { e.preventDefault(); nav(`/practice/${groupId}/${topicId}`); }}
        >
          Go practise {topic ? topic.title : ''}
        </a>
      </div>
    </div>
  );
}

function ChartCheatsheetPage({ domainId, groupId, topicId }) {
  const key = `${domainId}/${groupId}/${topicId}`;
  const sheet = window.CHART_CHEATSHEETS[key];

  if (!sheet) return <NotFound />;

  return (
    <div className="page page--reading">
      <div className="reading-head">
        <span className="badge badge--cheatsheet">{sheet.eyebrow}</span>
        <h1 className="reading-title">{sheet.title}</h1>
      </div>
      <p className="article">{sheet.deck}</p>

      <section className="reading-section">
        <h2>Structures</h2>
        <div className="structure-list">
          {sheet.structures.map((s, i) => (
            <div key={i} className="structure-item">
              <p className="structure-item__pattern">{renderTemplateSlots(s.pattern)}</p>
              <p className="structure-item__example">{s.example}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reading-section">
        <h2>Collocations</h2>
        <div className="collocation-grid">
          {sheet.collocations.map((c, i) => (
            <div key={i} className="collocation-item">
              <div className="collocation-item__phrase">{c.phrase}</div>
              <div className="collocation-item__use">{c.use}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="reading-section">
        <h2>Static vs. Dynamic Description</h2>
        <div className="compare-grid">
          <div className="compare-box">
            <div className="compare-box__title">Static (no time change)</div>
            <ul className="compare-box__list">
              {sheet.staticDynamic.static.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div className="compare-box">
            <div className="compare-box__title">Dynamic (change over time)</div>
            <ul className="compare-box__list">
              {sheet.staticDynamic.dynamic.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="reading-section">
        <div className="callout callout--danger">
          <div className="callout__title">Avoid</div>
          <ul className="callout__list">
            {sheet.danger.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="callout callout--tip">
          <div className="callout__title">Tips</div>
          <ul className="callout__list">
            {sheet.tips.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="reading-section">
        <h2>Prepositions & Time Expressions</h2>
        <table className="vocab">
          <tbody>
            {sheet.prepositions.map((p, i) => (
              <tr key={i}>
                <td className="vocab__casual">{p.key}</td>
                <td className="vocab__formal">{p.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="reading-foot">
        <a
          className="btn"
          href={`#/${domainId}/${groupId}/guide/${topicId}`}
          onClick={e => { e.preventDefault(); nav(`/${domainId}/${groupId}/guide/${topicId}`); }}
        >
          Open Guide
        </a>
      </div>
    </div>
  );
}

// Render [slot] markers in templates as styled chips
function renderTemplateSlots(text) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((p, i) => {
    if (p.startsWith('[') && p.endsWith(']')) {
      return <span key={i} className="slot">{p.slice(1, -1)}</span>;
    }
    return <span key={i}>{p}</span>;
  });
}

Object.assign(window, { InstructionPage, CheatsheetPage, ModelSentence, GuidePage, ChartCheatsheetPage });
