// shadow-typing.jsx — Shadow typing engine: utility functions + React components

const { useState: useStateST, useEffect: useEffectST, useRef: useRefST } = React;

// ── Pure utility functions ────────────────────────────────────────────────

function getCharStatus(typed, target) {
  return target.split('').map((_, i) => {
    if (i < typed.length) return typed[i] === target[i] ? 'correct' : 'incorrect';
    if (i === typed.length) return 'cursor';
    return 'pending';
  });
}

function isComplete(typed, target) {
  return target.length > 0 && typed === target;
}

function nextQueueState(queue, index, hadError) {
  const newQueue = hadError ? [...queue, queue[index]] : queue;
  const nextIndex = index + 1;
  return { queue: newQueue, index: nextIndex, done: nextIndex >= newQueue.length };
}

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Small display components ──────────────────────────────────────────────

function BandBadge({ band }) {
  if (!band) return null;
  return <span className={`band-badge band-badge--b${band}`}>B{band}</span>;
}

function PhraseDisplay({ phrase, typed, mode }) {
  const statuses = getCharStatus(typed, phrase);
  return (
    <div className={`phrase-display phrase-display--${mode}`}>
      {phrase.split('').map((char, i) => (
        <span key={i} className={`char char--${statuses[i]}`}>
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </div>
  );
}

function CategoryVisual({ categoryId }) {
  const a = 'var(--accent, currentColor)';
  const s = 'var(--accent-soft, var(--paper-3))';

  const v = {
    'line-graphs': (
      <svg viewBox="0 0 88 60" fill="none" aria-hidden="true">
        <line x1="12" y1="8" x2="12" y2="52" stroke="currentColor" strokeOpacity=".12" strokeWidth="1"/>
        <line x1="12" y1="52" x2="82" y2="52" stroke="currentColor" strokeOpacity=".12" strokeWidth="1"/>
        <line x1="12" y1="36" x2="82" y2="36" stroke="currentColor" strokeOpacity=".07" strokeWidth=".8"/>
        <line x1="12" y1="20" x2="82" y2="20" stroke="currentColor" strokeOpacity=".07" strokeWidth=".8"/>
        <polyline points="16,48 30,38 44,28 58,20 72,12" stroke={a} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="16,44 30,42 44,40 58,38 72,32" stroke={a} strokeWidth="1.8" strokeOpacity=".4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2.5"/>
        <circle cx="16" cy="48" r="2.5" fill={a}/>
        <circle cx="44" cy="28" r="2.5" fill={a}/>
        <circle cx="72" cy="12" r="2.5" fill={a}/>
      </svg>
    ),
    'bar-charts': (
      <svg viewBox="0 0 88 60" fill="none" aria-hidden="true">
        <line x1="10" y1="52" x2="82" y2="52" stroke="currentColor" strokeOpacity=".12" strokeWidth="1"/>
        <line x1="10" y1="8" x2="10" y2="52" stroke="currentColor" strokeOpacity=".12" strokeWidth="1"/>
        <rect x="16" y="30" width="13" height="22" rx="2" fill={a} opacity=".55"/>
        <rect x="34" y="14" width="13" height="38" rx="2" fill={a} opacity=".9"/>
        <rect x="52" y="22" width="13" height="30" rx="2" fill={a} opacity=".7"/>
        <rect x="70" y="38" width="13" height="14" rx="2" fill={a} opacity=".45"/>
      </svg>
    ),
    'pie-charts': (
      <svg viewBox="0 0 64 60" fill="none" aria-hidden="true">
        <path d="M32,30 L32,8 A22,22 0 0,1 50.8,41.2 Z" fill={a} opacity=".85"/>
        <path d="M32,30 L50.8,41.2 A22,22 0 0,1 9.2,35.8 Z" fill={a} opacity=".5"/>
        <path d="M32,30 L9.2,35.8 A22,22 0 0,1 32,8 Z" fill={a} opacity=".25"/>
        <line x1="32" y1="30" x2="32" y2="8" stroke="var(--paper,#fff)" strokeWidth="1.5"/>
        <line x1="32" y1="30" x2="50.8" y2="41.2" stroke="var(--paper,#fff)" strokeWidth="1.5"/>
        <line x1="32" y1="30" x2="9.2" y2="35.8" stroke="var(--paper,#fff)" strokeWidth="1.5"/>
      </svg>
    ),
    'maps': (
      <svg viewBox="0 0 88 60" fill="none" aria-hidden="true">
        <path d="M14,50 L8,28 L18,12 L34,10 L52,16 L68,12 L78,24 L74,42 L58,52 L34,54 Z"
              fill={s} stroke={a} strokeOpacity=".45" strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="6" y1="32" x2="82" y2="32" stroke="currentColor" strokeOpacity=".07" strokeWidth=".8" strokeDasharray="4 3"/>
        <line x1="44" y1="4" x2="44" y2="58" stroke="currentColor" strokeOpacity=".07" strokeWidth=".8" strokeDasharray="4 3"/>
        <path d="M22,44 L40,32 L56,36" stroke={a} strokeOpacity=".4" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2"/>
        <circle cx="40" cy="27" r="6" fill={a} opacity=".9"/>
        <circle cx="40" cy="27" r="2.5" fill="var(--paper,#fff)"/>
      </svg>
    ),
    'processes': (
      <svg viewBox="0 0 96 60" fill="none" aria-hidden="true">
        <rect x="4" y="22" width="22" height="16" rx="4" fill={s} stroke={a} strokeOpacity=".7" strokeWidth="1.5"/>
        <line x1="11" y1="30" x2="19" y2="30" stroke={a} strokeOpacity=".6" strokeWidth="1.2"/>
        <line x1="15" y1="26" x2="15" y2="34" stroke={a} strokeOpacity=".6" strokeWidth="1.2"/>
        <polyline points="26,30 36,30" stroke={a} strokeOpacity=".6" strokeWidth="1.5" strokeLinecap="round"/>
        <polygon points="34,27 39,30 34,33" fill={a} opacity=".6"/>
        <rect x="39" y="22" width="22" height="16" rx="4" fill={a} opacity=".2" stroke={a} strokeOpacity=".9" strokeWidth="1.5"/>
        <circle cx="50" cy="30" r="4" fill={a} opacity=".7"/>
        <polyline points="61,30 71,30" stroke={a} strokeOpacity=".6" strokeWidth="1.5" strokeLinecap="round"/>
        <polygon points="69,27 74,30 69,33" fill={a} opacity=".6"/>
        <rect x="74" y="22" width="18" height="16" rx="4" fill={s} stroke={a} strokeOpacity=".55" strokeWidth="1.5"/>
        <polyline points="79,32 84,26 90,34" stroke={a} strokeOpacity=".7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'tables': (
      <svg viewBox="0 0 88 60" fill="none" aria-hidden="true">
        <rect x="8" y="10" width="72" height="40" rx="4" fill={s} stroke={a} strokeOpacity=".3" strokeWidth="1.5"/>
        <rect x="8" y="10" width="72" height="12" rx="4" fill={a} opacity=".2"/>
        <line x1="8" y1="22" x2="80" y2="22" stroke={a} strokeOpacity=".3" strokeWidth="1"/>
        <line x1="32" y1="10" x2="32" y2="50" stroke={a} strokeOpacity=".18" strokeWidth="1"/>
        <line x1="56" y1="10" x2="56" y2="50" stroke={a} strokeOpacity=".18" strokeWidth="1"/>
        <line x1="8" y1="33" x2="80" y2="33" stroke={a} strokeOpacity=".12" strokeWidth="1"/>
        <circle cx="20" cy="28" r="2" fill={a} opacity=".5"/>
        <circle cx="44" cy="28" r="2" fill={a} opacity=".85"/>
        <circle cx="68" cy="28" r="2" fill={a} opacity=".4"/>
        <circle cx="20" cy="41" r="2" fill={a} opacity=".3"/>
        <circle cx="44" cy="41" r="2" fill={a} opacity=".6"/>
        <circle cx="68" cy="41" r="2" fill={a} opacity=".3"/>
      </svg>
    ),
    'conditionals': (
      <svg viewBox="0 0 96 60" fill="none" aria-hidden="true">
        <rect x="4" y="19" width="36" height="22" rx="5" fill={s} stroke={a} strokeOpacity=".6" strokeWidth="1.5"/>
        <text x="22" y="34" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={a} opacity=".9" fontWeight="700">Had S V³</text>
        <polyline points="40,30 53,30" stroke={a} strokeOpacity=".7" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="51,26.5 57,30 51,33.5" fill={a} opacity=".7"/>
        <rect x="57" y="19" width="35" height="22" rx="5" fill={s} stroke={a} strokeOpacity=".4" strokeWidth="1.5"/>
        <text x="74" y="34" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fill={a} opacity=".75">would V³</text>
      </svg>
    ),
    'passive': (
      <svg viewBox="0 0 96 60" fill="none" aria-hidden="true">
        <text x="18" y="24" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="currentColor" opacity=".4">Subject</text>
        <polyline points="36,22 56,22" stroke={a} strokeOpacity=".7" strokeWidth="1.8" strokeLinecap="round"/>
        <polygon points="54,19 60,22 54,25" fill={a} opacity=".7"/>
        <text x="75" y="24" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fill={a} opacity=".9">is/was V³</text>
        <text x="48" y="44" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill="currentColor" opacity=".35">(by agent)</text>
        <line x1="10" y1="34" x2="86" y2="34" stroke="currentColor" strokeOpacity=".1" strokeWidth="1"/>
      </svg>
    ),
    'inversion': (
      <svg viewBox="0 0 96 60" fill="none" aria-hidden="true">
        <text x="10" y="22" fontFamily="monospace" fontSize="9.5" fill="currentColor" opacity=".3">If S had V...</text>
        <path d="M8,30 Q48,52 88,26" stroke={a} strokeOpacity=".65" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <polygon points="86,22 92,26 86,30" fill={a} opacity=".65"/>
        <text x="10" y="52" fontFamily="monospace" fontSize="9.5" fill={a} opacity=".85" fontWeight="600">Not only / Had...</text>
      </svg>
    ),
    'reported-speech': (
      <svg viewBox="0 0 96 60" fill="none" aria-hidden="true">
        <line x1="8" y1="6" x2="8" y2="56" stroke={a} strokeOpacity=".5" strokeWidth="2.5" strokeLinecap="round"/>
        <text x="16" y="22" fontFamily="monospace" fontSize="9.5" fill="currentColor" opacity=".35">will</text>
        <text x="48" y="22" fontFamily="monospace" fontSize="9.5" fill={a} opacity=".85">→ would</text>
        <text x="16" y="36" fontFamily="monospace" fontSize="9.5" fill="currentColor" opacity=".35">is</text>
        <text x="48" y="36" fontFamily="monospace" fontSize="9.5" fill={a} opacity=".85">→ was</text>
        <text x="16" y="50" fontFamily="monospace" fontSize="9.5" fill="currentColor" opacity=".35">can</text>
        <text x="48" y="50" fontFamily="monospace" fontSize="9.5" fill={a} opacity=".65">→ could</text>
      </svg>
    ),
    'cleft': (
      <svg viewBox="0 0 96 60" fill="none" aria-hidden="true">
        <text x="8" y="22" fontFamily="monospace" fontSize="10" fill="currentColor" opacity=".35">It is</text>
        <rect x="36" y="10" width="26" height="16" rx="3" fill={a} opacity=".2" stroke={a} strokeWidth="1.2" strokeOpacity=".7"/>
        <text x="49" y="22" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={a} fontWeight="700" opacity=".9">X</text>
        <text x="67" y="22" fontFamily="monospace" fontSize="10" fill="currentColor" opacity=".35">that Y</text>
        <text x="8" y="46" fontFamily="monospace" fontSize="9" fill={a} opacity=".65">What S V is [X]</text>
      </svg>
    ),
    'overviews': (
      <svg viewBox="0 0 96 60" fill="none" aria-hidden="true">
        <rect x="8" y="8" width="80" height="9" rx="2" fill={a} opacity=".22"/>
        <text x="12" y="16.5" fontFamily="sans-serif" fontSize="6.5" fill={a} opacity=".75" fontWeight="600">Overall, it is clear that…</text>
        <rect x="8" y="23" width="68" height="5" rx="2" fill="currentColor" opacity=".09"/>
        <rect x="8" y="33" width="76" height="5" rx="2" fill="currentColor" opacity=".09"/>
        <rect x="8" y="43" width="48" height="5" rx="2" fill="currentColor" opacity=".09"/>
      </svg>
    ),
    'discourse-markers': (
      <svg viewBox="0 0 96 60" fill="none" aria-hidden="true">
        <rect x="6" y="8" width="36" height="18" rx="3" fill={s} stroke={a} strokeOpacity=".3" strokeWidth="1"/>
        <rect x="6" y="34" width="36" height="18" rx="3" fill={s} stroke={a} strokeOpacity=".3" strokeWidth="1"/>
        <polyline points="42,17 54,17" stroke={a} strokeOpacity=".6" strokeWidth="1.5" strokeLinecap="round"/>
        <polygon points="52,14 58,17 52,20" fill={a} opacity=".6"/>
        <polyline points="42,43 54,43" stroke={a} strokeOpacity=".4" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="58" y="6" width="32" height="48" rx="3" fill={a} opacity=".12" stroke={a} strokeOpacity=".4" strokeWidth="1"/>
        <text x="74" y="24" textAnchor="middle" fontFamily="sans-serif" fontSize="7.5" fill={a} opacity=".8">More-</text>
        <text x="74" y="34" textAnchor="middle" fontFamily="sans-serif" fontSize="7.5" fill={a} opacity=".8">over,</text>
        <text x="74" y="44" textAnchor="middle" fontFamily="sans-serif" fontSize="7.5" fill={a} opacity=".6">Never-</text>
      </svg>
    ),
    'approximation': (
      <svg viewBox="0 0 96 60" fill="none" aria-hidden="true">
        <line x1="8" y1="30" x2="88" y2="30" stroke="currentColor" strokeOpacity=".18" strokeWidth="1"/>
        <line x1="16" y1="24" x2="16" y2="36" stroke="currentColor" strokeOpacity=".15" strokeWidth="1"/>
        <line x1="48" y1="22" x2="48" y2="38" stroke={a} strokeOpacity=".5" strokeWidth="1.5"/>
        <line x1="80" y1="24" x2="80" y2="36" stroke="currentColor" strokeOpacity=".15" strokeWidth="1"/>
        <rect x="28" y="23" width="40" height="14" rx="7" fill={s} stroke={a} strokeOpacity=".55" strokeWidth="1.5"/>
        <text x="48" y="33.5" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fill={a} fontWeight="700">~40%</text>
        <text x="6" y="50" fontFamily="monospace" fontSize="7.5" fill="currentColor" opacity=".35">just under</text>
        <text x="66" y="50" fontFamily="monospace" fontSize="7.5" fill="currentColor" opacity=".35">well over</text>
      </svg>
    ),
  };

  const visual = v[categoryId];
  if (!visual) return null;
  return <div className="category-visual">{visual}</div>;
}

function parseNote(note) {
  const sep = note.indexOf(' — ');
  if (sep < 0) return { title: note, desc: '', pills: [] };
  const title = note.slice(0, sep);
  const full = note.slice(sep + 3);
  if (full.includes(' / '))
    return { title, desc: '', pills: full.split(' / ').map(s => s.trim()) };
  const parts = full.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length >= 2)
    return { title, desc: '', pills: parts };
  return { title, desc: full, pills: [] };
}

function GrammarNote({ note, band }) {
  if (!note) return null;
  const { title, desc, pills } = parseNote(note);
  return (
    <div className="grammar-note">
      <BandBadge band={band} />
      <span className="grammar-note__title">{title}</span>
      {desc && <span className="grammar-note__sep">—</span>}
      {desc && <span className="grammar-note__desc">{desc}</span>}
      {pills.length > 0 && (
        <div className="grammar-note__pills">
          {pills.map(p => <span key={p} className="grammar-note__pill">{p}</span>)}
        </div>
      )}
    </div>
  );
}

// ── ShadowCategorySelector ────────────────────────────────────────────────

function ShadowCategorySelector({ domainId }) {
  const domainData = window.SHADOW_DATA[domainId];
  return (
    <div className="shadow-selector" data-domain={domainId}>
      <h2 className="shadow-selector__heading">{domainData.title}</h2>
      <div className="shadow-cat-grid">
        {domainData.categories.map(cat => {
          const bands = cat.sentences.map(s => s.band).filter(Boolean);
          const bandMin = bands.length ? Math.min(...bands) : null;
          const bandMax = bands.length ? Math.max(...bands) : null;
          const bandRange = bandMin ? (bandMin === bandMax ? `B${bandMin}` : `B${bandMin}–B${bandMax}`) : '';
          return (
            <a
              key={cat.id}
              href={`#/${domainId}/${cat.id}`}
              className="shadow-cat-card"
              onClick={e => { e.preventDefault(); nav(`/${domainId}/${cat.id}`); }}
            >
              <div className="gc-head">
                <div>
                  <div className="gc-title">{cat.icon} {cat.title}</div>
                  <div className="gc-meta" style={{ marginTop: 4 }}>
                    {cat.sentences.length} phrases{bandRange ? ` · ${bandRange}` : ''}
                  </div>
                </div>
                <span className="gc-arrow">→</span>
              </div>
              <div className="gc-pills">
                {bandRange && (
                  <span className="pill">
                    <span className="pill-dot" />
                    {bandRange}
                  </span>
                )}
                <span className="pill">
                  <span className="pill-dot" />
                  {cat.sentences.length} phrases
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ── ShadowCompletePage ────────────────────────────────────────────────────

function ShadowCompletePage({ domainId, categoryId }) {
  const category = window.SHADOW_DATA[domainId].categories.find(c => c.id === categoryId);
  return (
    <div className="shadow-complete">
      <div className="shadow-complete__check">✓</div>
      <h2 className="shadow-complete__title">{category.title} complete!</h2>
      <p className="shadow-complete__sub">All phrases typed without errors.</p>
      <div className="shadow-complete__actions">
        <a
          href={`#/${domainId}/${categoryId}`}
          className="shadow-btn shadow-btn--primary"
          onClick={e => { e.preventDefault(); nav(`/${domainId}/${categoryId}`); }}
        >Practice again</a>
        <a
          href={`#/${domainId}`}
          className="shadow-btn shadow-btn--secondary"
          onClick={e => { e.preventDefault(); nav(`/${domainId}`); }}
        >All categories</a>
      </div>
    </div>
  );
}

// ── ShadowTypingPage ──────────────────────────────────────────────────────

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
        if (e.key === ' ') e.preventDefault();
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

  if (done) return <ShadowCompletePage domainId={domainId} categoryId={categoryId} />;

  return (
    <div className="doc-view">
      <div className="doc-subnav">
        <div className="doc-subnav__left">
          <a
            href={'#/' + domainId}
            className="doc-back-btn"
            onClick={e => { e.preventDefault(); nav('/' + domainId); }}
          >← Back</a>
          <span className="doc-subnav__title">{category.icon} {category.title}</span>
        </div>
        <div className="doc-subnav__right">
          <div className="mode-toggle">
            <button
              className={'mode-btn' + (mode === 'basic' ? ' mode-btn--active' : '')}
              onClick={() => setMode('basic')}
            >Basic</button>
            <button
              className={'mode-btn' + (mode === 'memory' ? ' mode-btn--active' : '')}
              onClick={() => setMode('memory')}
            >Memory</button>
          </div>
          <span className="doc-subnav__progress">
            <b>{completedPhrases.size}</b> / {sentences.length}
          </span>
        </div>
      </div>
      <div className="doc-body">
        {sentences.map((sentence, i) => {
          const isActive = activePhraseIndex === i;
          const isDone = completedPhrases.has(i);
          const typed = phraseInputs[i];
          const statuses = getCharStatus(typed, sentence.text);
          const memoryActive = mode === 'memory' && isActive;
          return (
            <div
              key={i}
              className={'phrase-row' + (isDone ? ' phrase-row--done' : '') + (isActive ? ' phrase-row--active' : '')}
              onClick={() => handlePhraseClick(i)}
            >
              <div className="phrase-row__num">
                {String(i + 1).padStart(2, '0')}
                {isDone && <span className="phrase-row__check">✓</span>}
              </div>
              <div className={'phrase-row__text' + (memoryActive ? ' phrase-row__text--memory-active' : '')}>
                {sentence.text.split('').map((char, j) => {
                  if (isDone) return <span key={j} className="char char--done">{char}</span>;
                  const st = (!isActive && statuses[j] === 'cursor') ? 'pending' : statuses[j];
                  return <span key={j} className={'char char--' + st}>{char}</span>;
                })}
              </div>
              {sentence.grammar && <GrammarNote note={sentence.grammar} band={sentence.band} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
