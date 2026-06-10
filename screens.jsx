// screens.jsx — Home, Domain, Group views

const { useEffect, useState, useMemo } = React;

// ─────────────────────────────────────────────────────────────────────────────
// Router (hash-based)
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Home — two big domain cards filling the viewport
// ─────────────────────────────────────────────────────────────────────────────
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
                <span className="home-card__index">0{data.domains.indexOf(d) + 1} / 02</span>
              </div>

              <h2 className="home-card__name">
                {d.id === 'guidebook' ? (
                  <>
                    <b>Guide</b>book<span className="dot">.</span>
                  </>
                ) : (
                  <>
                    <b>Prac</b>tice<span className="dot">.</span>
                  </>
                )}
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
                        {g.topics ? `${g.topics.length} topics` : g.meta}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="home-card__cta">
                Enter {d.title}
                <span className="arrow">→</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain page — list of groups under one domain
// ─────────────────────────────────────────────────────────────────────────────
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
        <div className="meta">
          {domain.groups.length} groups · {countNodes(domain)} nodes
        </div>
      </div>

      <hr className="rule" />

      <div className="groups">
        {domain.groups.map((g) => (
          <GroupRow key={g.id} domain={domain} group={g} />
        ))}
      </div>
    </div>
  );
}

function countNodes(domain) {
  return domain.groups.reduce((acc, g) => {
    if (g.topics) return acc + g.topics.length;
    if (g.guideSections) return acc + g.guideSections.length;
    return acc + g.nodes.length;
  }, 0);
}

function GroupRow({ domain, group }) {
  const isPractice = !!group.topics;
  const isFirstGuidebookGroup = !isPractice && domain.groups.indexOf(group) === 0;
  return (
    <a
      className="group-card"
      href={`#/${domain.id}/${group.id}`}
      onClick={(e) => { e.preventDefault(); nav(`/${domain.id}/${group.id}`); }}
    >
      {isFirstGuidebookGroup && <div className="gc-note">Start here</div>}
      <div className="gc-head">
        <div>
          <div className="gc-title">{group.title}</div>
          <div className="gc-meta" style={{ marginTop: 4 }}>{group.meta}</div>
        </div>
        <span className="gc-arrow">→</span>
      </div>

      <div className="gc-pills">
        {isPractice
          ? group.topics.map((t) => (
              <span key={t.id} className="pill">
                <span className="pill-dot" />
                {t.title}
              </span>
            ))
          : group.guideSections
          ? group.guideSections.map((s) => (
              <span key={s.id} className={`badge badge--${s.id === 'guide' ? 'instruction' : 'cheatsheet'}`}>
                {s.title}
              </span>
            ))
          : group.nodes.map((n) => (
              <span key={n} className={`badge badge--${n}`}>
                {n}
              </span>
            ))}
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Group page
// ─────────────────────────────────────────────────────────────────────────────
function GroupPage({ domainId, groupId }) {
  const data = window.IELTS_DATA;
  const domain = data.domains.find((d) => d.id === domainId);
  const group = domain && domain.groups.find((g) => g.id === groupId);
  if (!domain || !group) return <NotFound />;

  const isPractice = !!group.topics;
  const isGuideSections = !!group.guideSections;

  return (
    <div className="page" data-domain={domain.id}>
      <div className="section-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {domain.title} · {group.meta}
          </div>
          <h1>{group.title}</h1>
          <p className="subtitle">
            {isPractice
              ? `Pick a visual type. Each topic uses a real exam-style prompt with a model answer to retype.`
              : isGuideSections
              ? `Browse the in-depth Guide for theory and model sentences, or keep the Cheatsheet open for quick reference while you write.`
              : `Two reference modules. Read the Instruction once for theory; keep the Cheatsheet open while you practise.`}
          </p>
        </div>
        <div className="meta">
          {isPractice
            ? `${group.topics.length} topics`
            : isGuideSections
            ? `${group.guideSections.length} sections`
            : `${group.nodes.length} nodes`}
        </div>
      </div>

      <hr className="rule" />

      {isPractice
        ? <TopicGrid domain={domain} group={group} />
        : isGuideSections
        ? <GuideSectionList domain={domain} group={group} />
        : <NodeList domain={domain} group={group} />}
    </div>
  );
}

function GuideSectionList({ domain, group }) {
  return (
    <div className="node-list">
      {group.guideSections.map(section => (
        <a
          key={section.id}
          className="node-card"
          href={`#/${domain.id}/${group.id}/${section.id}`}
          onClick={e => { e.preventDefault(); nav(`/${domain.id}/${group.id}/${section.id}`); }}
        >
          <span className={`badge badge--${section.id === 'guide' ? 'instruction' : 'cheatsheet'}`}>
            {section.title}
          </span>
          <p className="node-card__body">{section.summary}</p>
        </a>
      ))}
    </div>
  );
}

function ChartHubPage({ domainId, groupId, sectionId }) {
  const data = window.IELTS_DATA;
  const dom = data.domains.find(d => d.id === domainId);
  const grp = dom && dom.groups.find(g => g.id === groupId);
  const section = grp && grp.guideSections && grp.guideSections.find(s => s.id === sectionId);
  const badgeClass = sectionId === 'guide' ? 'badge--instruction' : 'badge--cheatsheet';

  if (!section) return <NotFound />;

  return (
    <div className="page page--reading topic-hub" data-domain={domainId}>
      <div className="reading-head">
        <span className={`badge ${badgeClass}`}>{section.title}</span>
        <h1 className="reading-title">Task 1 · {section.title}</h1>
      </div>
      <p className="reading-deck">{section.summary}</p>
      <div className="topic-grid">
        {(section.topics || []).map(topic => (
          <a
            key={topic.id}
            className="topic-card"
            href={`#/${domainId}/${groupId}/${sectionId}/${topic.id}`}
            onClick={e => { e.preventDefault(); nav(`/${domainId}/${groupId}/${sectionId}/${topic.id}`); }}
          >
            <span className="topic-card__icon">{topic.icon}</span>
            <span className="topic-card__title">{topic.title}</span>
          </a>
        ))}
      </div>
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
              <span className="node-card__arrow">→</span>
            </div>
            <h3 className="node-card__title">
              {isInstruction
                ? 'Theory, structure, and what examiners want'
                : 'Phrases, vocab swaps, and ready templates'}
            </h3>
            <p className="node-card__body">
              {isInstruction
                ? 'Long-form module covering scoring criteria, time budget, and the anatomy of a band-7+ answer. Read once, return to specific sections as needed.'
                : 'Reference card you can keep open beside the typing exercises. Phrase banks grouped by rhetorical function, formal synonym table, and adaptable sentence templates.'}
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
      <p>That route doesn't exist.</p>
      <button className="btn" onClick={() => nav('/')}>Back home</button>
    </div>
  );
}

// Export
Object.assign(window, {
  useHashRoute, nav,
  Home, DomainPage, GroupPage, NotFound, ChartHubPage,
});
