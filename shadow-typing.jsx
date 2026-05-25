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

function GrammarNote({ note, band }) {
  if (!note) return null;
  return (
    <div className="grammar-note">
      <BandBadge band={band} />
      <span className="grammar-note__text">{note}</span>
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
  const originalCount = category.sentences.length;

  const [queue, setQueue] = useStateST(() => [...category.sentences]);
  const [idx, setIdx] = useStateST(0);
  const [typed, setTyped] = useStateST('');
  const [mode, setMode] = useStateST('basic');
  const [done, setDone] = useStateST(false);
  const hadErrorRef = useRefST(false);
  const textareaRef = useRefST(null);

  const currentSentence = queue[idx] || {};
  const phrase = currentSentence.text || '';
  const complete = isComplete(typed, phrase);
  const isRepeating = idx >= originalCount;

  useEffectST(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, [idx, done]);

  useEffectST(() => {
    if (!complete) return;
    const timer = setTimeout(() => {
      const next = nextQueueState(queue, idx, hadErrorRef.current);
      hadErrorRef.current = false;
      setTyped('');
      if (next.done) {
        setDone(true);
      } else {
        setQueue(next.queue);
        setIdx(next.index);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [complete]);

  if (done) {
    return <ShadowCompletePage domainId={domainId} categoryId={categoryId} />;
  }

  return (
    <div className="shadow-typing-page">
      <div className="shadow-typing-page__header">
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${queue.length ? Math.round((idx / queue.length) * 100) : 0}%` }}
          />
        </div>
        <span className={`phrase-counter${isRepeating ? ' phrase-counter--repeat' : ''}`}>
          {idx + 1} / {queue.length}
        </span>
      </div>

      <div className="mode-toggle">
        <button
          className={`mode-btn${mode === 'basic' ? ' mode-btn--active' : ''}`}
          onClick={() => setMode('basic')}
        >Basic</button>
        <button
          className={`mode-btn${mode === 'memory' ? ' mode-btn--active' : ''}`}
          onClick={() => setMode('memory')}
        >Memory</button>
      </div>

      <div className="phrase-wrap">
        <PhraseDisplay phrase={phrase} typed={typed} mode={mode} />
        <textarea
          ref={textareaRef}
          className="shadow-textarea"
          value={typed}
          onChange={e => {
            const val = e.target.value.slice(0, phrase.length);
            if (!hadErrorRef.current) {
              for (let i = 0; i < val.length; i++) {
                if (val[i] !== phrase[i]) { hadErrorRef.current = true; break; }
              }
            }
            setTyped(val);
          }}
          onKeyDown={e => {
            if (e.key === 'Tab') {
              e.preventDefault();
              setMode(m => m === 'basic' ? 'memory' : 'basic');
            }
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      <GrammarNote note={category.note} band={currentSentence.band} />
    </div>
  );
}
