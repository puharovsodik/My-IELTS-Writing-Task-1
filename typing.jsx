// typing.jsx — Monkeytype-style typing exercise

const { useState: useStateT, useEffect: useEffectT, useRef: useRefT, useMemo: useMemoT, useCallback: useCallbackT } = React;

// ─────────────────────────────────────────────────────────────────────────────
// Chart placeholder — striped wireframe with mono caption
// ─────────────────────────────────────────────────────────────────────────────
function ChartPlaceholder({ kind, prompt }) {
  const labels = {
    line: 'LINE GRAPH · placeholder',
    bar: 'BAR CHART · placeholder',
    pie: 'PIE CHART · placeholder',
    map: 'MAP PAIR · placeholder',
    process: 'PROCESS DIAGRAM · placeholder',
    table: 'TABLE · placeholder',
    essay: 'PROMPT · no visual',
  };
  return (
    <div className={`chart chart--${kind}`}>
      <div className="chart__prompt">
        <div className="eyebrow" style={{ marginBottom: 10 }}>Prompt</div>
        <p>{prompt}</p>
      </div>
      <div className="chart__visual" aria-hidden="true">
        <svg className="chart__stripes" viewBox="0 0 320 180" preserveAspectRatio="none">
          <defs>
            <pattern id="stripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="320" height="180" fill="url(#stripes)" />
          {/* lightweight glyphs per kind */}
          {kind === 'line' && (
            <g stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.55">
              <polyline points="20,140 70,120 130,110 190,80 250,60 300,40" />
              <polyline points="20,150 70,140 130,125 190,110 250,90 300,80" strokeDasharray="3 3" />
              <polyline points="20,155 70,150 130,138 190,125 250,108 300,95" strokeDasharray="1 3" />
            </g>
          )}
          {kind === 'bar' && (
            <g fill="currentColor" opacity="0.5">
              <rect x="30" y="80" width="22" height="80" />
              <rect x="60" y="40" width="22" height="120" />
              <rect x="110" y="100" width="22" height="60" />
              <rect x="140" y="60" width="22" height="100" />
              <rect x="190" y="110" width="22" height="50" />
              <rect x="220" y="20" width="22" height="140" />
              <rect x="270" y="50" width="22" height="110" />
            </g>
          )}
          {kind === 'pie' && (
            <g stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.55">
              <circle cx="100" cy="90" r="55" />
              <line x1="100" y1="35" x2="100" y2="145" />
              <line x1="100" y1="90" x2="155" y2="78" />
              <circle cx="230" cy="90" r="55" />
              <line x1="230" y1="35" x2="230" y2="90" />
              <line x1="230" y1="90" x2="285" y2="105" />
              <line x1="230" y1="90" x2="180" y2="100" />
            </g>
          )}
          {kind === 'map' && (
            <g stroke="currentColor" fill="none" strokeWidth="1" opacity="0.5">
              <rect x="20" y="20" width="135" height="140" />
              <path d="M 30 130 Q 90 80 150 110" />
              <rect x="40" y="55" width="22" height="22" />
              <rect x="70" y="45" width="22" height="22" />
              <rect x="105" y="60" width="22" height="22" />
              <rect x="165" y="20" width="135" height="140" />
              <path d="M 175 130 Q 235 80 295 110" />
              <rect x="180" y="35" width="22" height="22" />
              <rect x="210" y="45" width="22" height="22" />
              <rect x="240" y="35" width="22" height="22" />
              <rect x="270" y="55" width="22" height="22" />
              <rect x="180" y="80" width="22" height="22" />
              <rect x="210" y="90" width="22" height="22" />
              <rect x="240" y="80" width="22" height="22" />
            </g>
          )}
          {kind === 'process' && (
            <g stroke="currentColor" fill="none" strokeWidth="1" opacity="0.55">
              <rect x="20" y="60" width="50" height="40" />
              <path d="M 75 80 L 105 80" markerEnd="url(#a)" />
              <rect x="110" y="60" width="50" height="40" />
              <path d="M 165 80 L 195 80" />
              <rect x="200" y="60" width="50" height="40" />
              <path d="M 255 80 L 285 80" />
              <rect x="290" y="60" width="20" height="40" />
            </g>
          )}
          {kind === 'table' && (
            <g stroke="currentColor" strokeWidth="0.8" opacity="0.5">
              <line x1="20" y1="30" x2="300" y2="30" />
              <line x1="20" y1="60" x2="300" y2="60" />
              <line x1="20" y1="90" x2="300" y2="90" />
              <line x1="20" y1="120" x2="300" y2="120" />
              <line x1="20" y1="150" x2="300" y2="150" />
              <line x1="20" y1="30" x2="20" y2="150" />
              <line x1="90" y1="30" x2="90" y2="150" />
              <line x1="160" y1="30" x2="160" y2="150" />
              <line x1="230" y1="30" x2="230" y2="150" />
              <line x1="300" y1="30" x2="300" y2="150" />
            </g>
          )}
          {kind === 'essay' && (
            <g stroke="currentColor" strokeWidth="0.8" opacity="0.45">
              <line x1="30" y1="40" x2="290" y2="40" />
              <line x1="30" y1="60" x2="290" y2="60" />
              <line x1="30" y1="80" x2="220" y2="80" />
              <line x1="30" y1="110" x2="290" y2="110" />
              <line x1="30" y1="130" x2="290" y2="130" />
              <line x1="30" y1="150" x2="240" y2="150" />
            </g>
          )}
        </svg>
        <div className="chart__caption mono">{labels[kind]}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mode helpers
// ─────────────────────────────────────────────────────────────────────────────

// "blanks" mode — pick ~1 in 7 words to blank out
function deriveBlanks(text) {
  // Tokenize keeping whitespace and punctuation in place
  const tokens = [];
  let buf = '';
  let inWord = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const isWordChar = /[A-Za-z0-9'-]/.test(c);
    if (isWordChar && !inWord) {
      if (buf) tokens.push({ kind: 'gap', text: buf }); buf = c; inWord = true;
    } else if (isWordChar && inWord) {
      buf += c;
    } else if (!isWordChar && inWord) {
      tokens.push({ kind: 'word', text: buf }); buf = c; inWord = false;
    } else {
      buf += c;
    }
  }
  if (buf) tokens.push({ kind: inWord ? 'word' : 'gap', text: buf });

  // Pick blanks deterministically — every 6th decent word, skipping <4 chars
  let wIdx = 0;
  return tokens.map((t) => {
    if (t.kind !== 'word') return t;
    wIdx++;
    if (t.text.length >= 5 && wIdx % 6 === 3) {
      return { ...t, blank: true };
    }
    return t;
  });
}

// Build the "active text" for current mode
function buildActiveText(mode, text, sentenceIdx) {
  if (mode === 'memory') {
    // Split into sentences; show one at a time
    const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
    const idx = Math.min(sentenceIdx, sentences.length - 1);
    return { text: sentences[idx].trim(), sentences, sentenceIdx: idx };
  }
  return { text, sentences: null, sentenceIdx: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// Typing canvas
// ─────────────────────────────────────────────────────────────────────────────
function TypingCanvas({ source, mode, onProgress, onComplete }) {
  const [typed, setTyped] = useStateT('');
  const [focused, setFocused] = useStateT(true);
  const containerRef = useRefT(null);
  const cursorRef = useRefT(null);

  // For blanks mode: pre-computed token list, and a flat list of blank ranges
  const blanksTokens = useMemoT(() => mode === 'blanks' ? deriveBlanks(source) : null, [source, mode]);

  // For memory mode: the visible-until-typing source remains the same; we hide
  // text via CSS once typing starts on it.
  const startedTypingRef = useRefT(false);
  const startTimeRef = useRefT(null);

  useEffectT(() => {
    setTyped('');
    startedTypingRef.current = false;
    startTimeRef.current = null;
  }, [source, mode]);

  // Keyboard listener — anywhere on the page
  useEffectT(() => {
    function onKey(e) {
      // Ignore modifier-chord keys
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // Ignore special keys we don't handle
      const k = e.key;
      if (k === 'Tab' || k === 'Escape' || k.startsWith('Arrow') || k === 'Shift' || k === 'CapsLock' ||
          k === 'Enter' || k === 'F5' || k === 'Home' || k === 'End' || k === 'PageUp' || k === 'PageDown') {
        if (k === 'Tab') return; // allow tab navigation
        return;
      }
      e.preventDefault();
      if (!startedTypingRef.current) {
        startedTypingRef.current = true;
        startTimeRef.current = performance.now();
      }
      if (k === 'Backspace') {
        setTyped((t) => t.slice(0, -1));
        return;
      }
      if (k.length === 1) {
        setTyped((t) => {
          if (t.length >= source.length) return t;
          const next = t + k;
          return next;
        });
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [source]);

  // Live stats
  const stats = useMemoT(() => {
    let correct = 0;
    let errors = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === source[i]) correct++;
      else errors++;
    }
    const total = typed.length || 1;
    const acc = (correct / total) * 100;
    const elapsedMs = startTimeRef.current ? (performance.now() - startTimeRef.current) : 0;
    const minutes = elapsedMs / 60000;
    // Gross WPM: (correctChars / 5) / minutes
    const wpm = minutes > 0 ? (correct / 5) / minutes : 0;
    const progress = (typed.length / source.length) * 100;
    return { correct, errors, acc, wpm, progress, elapsedMs };
  }, [typed, source]);

  // Notify parent
  useEffectT(() => {
    onProgress && onProgress(stats);
    if (typed.length >= source.length) {
      onComplete && onComplete(stats);
    }
  }, [stats, source.length, typed.length]);

  // Force a tick for live WPM/time
  const [, setTick] = useStateT(0);
  useEffectT(() => {
    if (typed.length === 0 || typed.length >= source.length) return;
    const id = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, [typed.length, source.length]);

  // Auto-scroll the typing area so cursor stays in view
  useEffectT(() => {
    const cursor = cursorRef.current;
    const container = containerRef.current;
    if (!cursor || !container) return;
    const cRect = cursor.getBoundingClientRect();
    const sRect = container.getBoundingClientRect();
    // If cursor is near the bottom edge, scroll inside the typing window
    const offsetTop = cursor.offsetTop;
    const window2 = container.clientHeight;
    const target = Math.max(0, offsetTop - window2 * 0.4);
    container.scrollTo({ top: target, behavior: 'smooth' });
  }, [typed.length]);

  // ── Render the text ──
  function renderRetype() {
    // Character-by-character spans
    const chars = [];
    for (let i = 0; i < source.length; i++) {
      const s = source[i];
      const t = typed[i];
      let cls = 'tc-pending';
      let content = s;
      if (i < typed.length) {
        if (t === s) cls = 'tc-correct';
        else {
          cls = 'tc-wrong';
          // Show wrong-typed char (substitute space placeholder if needed)
          content = s === ' ' ? '·' : s;
        }
      }
      const isCursorHere = i === typed.length;
      if (isCursorHere) {
        chars.push(<span key={`cur-${i}`} ref={cursorRef} className="tc-cursor" />);
      }
      // For spaces: keep them rendered so wrap works
      chars.push(
        <span key={i} className={cls} data-char={s}>
          {content}
        </span>
      );
    }
    if (typed.length === source.length) {
      chars.push(<span key="cur-end" ref={cursorRef} className="tc-cursor tc-cursor--done" />);
    }
    return chars;
  }

  function renderBlanks() {
    // Tokens; only "blank" word-tokens are typeable. We map global typed-index
    // to per-blank state.
    if (!blanksTokens) return null;
    const nodes = [];
    let blankCursor = 0; // index into the blanks-concatenated string
    const blanksFlat = blanksTokens.filter((t) => t.blank).map((t) => t.text).join(' ');
    blanksTokens.forEach((tok, i) => {
      if (tok.kind === 'gap') {
        nodes.push(<span key={i} className="tc-gap">{tok.text}</span>);
      } else if (tok.blank) {
        const tokTyped = typed.slice(blankCursor, blankCursor + tok.text.length);
        const chars = [];
        for (let j = 0; j < tok.text.length; j++) {
          const s = tok.text[j];
          const t = tokTyped[j];
          let cls = 'tc-blank-pending';
          if (j < tokTyped.length) cls = (t === s) ? 'tc-correct' : 'tc-wrong';
          if (blankCursor + j === typed.length) {
            chars.push(<span key={`cur-${i}-${j}`} ref={cursorRef} className="tc-cursor" />);
          }
          chars.push(<span key={`${i}-${j}`} className={cls}>{s}</span>);
        }
        if (blankCursor + tok.text.length === typed.length && blankCursor + tok.text.length <= blanksFlat.length) {
          // cursor at end of this blank — only render if we're not already at next blank's start (we advance via space)
        }
        nodes.push(<span key={i} className="tc-blank">{chars}</span>);
        blankCursor += tok.text.length;
        // Consume the space between blanks if present
        if (typed.length > blankCursor && typed[blankCursor] === ' ') {
          blankCursor += 1;
        }
      } else {
        nodes.push(<span key={i} className="tc-word-known">{tok.text}</span>);
      }
    });
    return nodes;
  }

  return (
    <div
      className={`tc ${focused ? 'tc--focused' : ''}`}
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="tc__viewport" ref={containerRef}>
        <div className="tc__text" data-mode={mode}>
          {mode === 'blanks' ? renderBlanks() : renderRetype()}
        </div>
      </div>
      {!focused && (
        <div className="tc__hint" onClick={(e) => e.currentTarget.parentElement.focus()}>
          Click to focus · start typing
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Typing page (top-level)
// ─────────────────────────────────────────────────────────────────────────────
function TypingPage({ domainId, groupId, topicId, mode }) {
  const key = `${domainId}/${groupId}/${topicId}`;
  const data = window.EXERCISES[key];
  if (!data) return <NotFound />;

  const [stats, setStats] = useStateT({ correct: 0, errors: 0, acc: 100, wpm: 0, progress: 0, elapsedMs: 0 });
  const [done, setDone] = useStateT(false);
  const [resetKey, setResetKey] = useStateT(0);
  const activeMode = mode || 'retype';

  const handleComplete = useCallbackT((s) => {
    setDone(true);
  }, []);

  return (
    <div className="page page--typing" data-domain={data.domain}>
      <div className="reading-head">
        <span className="badge badge--exercise">Exercise</span>
        <div className="eyebrow" style={{ marginTop: 18 }}>{data.eyebrow}</div>
        <h1 className="reading-title">{data.title}</h1>
      </div>

      <div className="typing-layout">
        <ChartPlaceholder kind={data.chartKind} prompt={data.prompt} />

        <div className="typing-main">
          <div className="typing-stats">
            <Stat label="WPM" value={stats.wpm.toFixed(0)} />
            <Stat label="Accuracy" value={`${stats.acc.toFixed(0)}%`} />
            <Stat label="Time" value={fmtTime(stats.elapsedMs)} />
            <Stat label="Progress" value={`${stats.progress.toFixed(0)}%`} />
            <button
              className="btn btn--ghost typing-reset"
              onClick={() => { setResetKey((k) => k + 1); setDone(false); setStats({ correct:0, errors:0, acc:100, wpm:0, progress:0, elapsedMs:0 }); }}
            >
              ↻ Restart
            </button>
          </div>

          <div className="typing-progressbar">
            <div className="typing-progressbar__fill" style={{ width: `${stats.progress}%` }} />
          </div>

          <div className="typing-mode-strip">
            <span className="eyebrow">Mode</span>
            <span className="typing-mode-strip__value">
              {activeMode === 'retype' && 'Retype · live correctness feedback'}
              {activeMode === 'blanks' && 'Fill in the blanks · type only the missing words'}
              {activeMode === 'memory' && 'Memory · sentence-by-sentence recall'}
            </span>
            <span className="typing-mode-strip__hint mono">Cycle in Tweaks ↘</span>
          </div>

          <TypingCanvas
            key={`${key}-${activeMode}-${resetKey}`}
            source={data.text}
            mode={activeMode}
            onProgress={setStats}
            onComplete={handleComplete}
          />

          {done && (
            <div className="typing-done">
              <div className="eyebrow">Complete</div>
              <div className="typing-done__row">
                <div><span className="typing-done__big">{stats.wpm.toFixed(0)}</span> wpm</div>
                <div><span className="typing-done__big">{stats.acc.toFixed(0)}%</span> accuracy</div>
                <div><span className="typing-done__big">{fmtTime(stats.elapsedMs)}</span> time</div>
              </div>
              <div className="typing-done__actions">
                <button className="btn btn--ghost" onClick={() => { setResetKey((k) => k + 1); setDone(false); }}>↻ Try again</button>
                <button className="btn" onClick={() => nav(`/${domainId}/${groupId}`)}>Pick another topic →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}</div>
    </div>
  );
}

function fmtTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

Object.assign(window, { TypingPage, ChartPlaceholder });
