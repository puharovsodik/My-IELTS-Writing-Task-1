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

Object.assign(window, { InstructionPage, CheatsheetPage, ModelSentence });
