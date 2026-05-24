// app.jsx — Top-level App, topbar, crumbs, routing dispatch

const { useEffect: useEffectA, useState: useStateA, useMemo: useMemoA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "retype",
  "density": "comfortable",
  "dark": false
}/*EDITMODE-END*/;

function parseRoute(hash) {
  // hash is e.g. "/practice/task1/line-graphs"
  const parts = hash.replace(/^\//, '').split('/').filter(Boolean);
  return parts;
}

function App() {
  const hash = useHashRoute();
  const route = useMemoA(() => parseRoute(hash), [hash]);

  // Tweaks
  const initialTweaks = useMemoA(() => {
    const t = { ...TWEAK_DEFAULTS };
    // Read URL params for canvas embedding
    try {
      const u = new URL(window.location.href);
      if (u.searchParams.get('density')) t.density = u.searchParams.get('density');
      if (u.searchParams.get('dark')) t.dark = u.searchParams.get('dark') === '1' || u.searchParams.get('dark') === 'true';
      if (u.searchParams.get('mode')) t.mode = u.searchParams.get('mode');
    } catch (e) {}
    return t;
  }, []);

  const [t, setTweak] = useTweaks(initialTweaks);

  // Apply density + dark mode to <html>
  useEffectA(() => {
    document.documentElement.dataset.density = t.density;
    document.documentElement.dataset.theme = t.dark ? 'dark' : 'light';
  }, [t.density, t.dark]);

  // Determine screen
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
    if (route[2] === 'instruction') {
      screen = <InstructionPage domainId={route[0]} groupId={route[1]} />;
    } else if (route[2] === 'cheatsheet') {
      screen = <CheatsheetPage domainId={route[0]} groupId={route[1]} />;
    } else {
      // it's a topic → typing exercise
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
        <TweakRadio
          label="Mode"
          value={t.mode}
          options={['retype', 'blanks', 'memory']}
          onChange={(v) => setTweak('mode', v)}
        />

        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['comfortable', 'compact']}
          onChange={(v) => setTweak('density', v)}
        />

        <TweakSection label="Theme" />
        <TweakToggle
          label="Dark mode"
          value={t.dark}
          onChange={(v) => setTweak('dark', v)}
        />
      </TweaksPanel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Top bar
// ─────────────────────────────────────────────────────────────────────────────
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
    // L3
    let label = route[2];
    if (label === 'instruction') label = 'Instruction';
    else if (label === 'cheatsheet') label = 'Cheatsheet';
    else {
      const dom = data.domains.find((d) => d.id === route[0]);
      const grp = dom && dom.groups.find((g) => g.id === route[1]);
      const top = grp && grp.topics && grp.topics.find((t) => t.id === route[2]);
      if (top) label = top.title;
    }
    crumbs.push({ label, path: null, domain: route[0] });
  }

  return (
    <div className="topbar" data-domain={route[0] || undefined}>
      <a
        className="wordmark"
        href="#/"
        onClick={(e) => { e.preventDefault(); nav('/'); }}
      >
        IELTS<span style={{ color: 'var(--ink-mute)', margin: '0 6px' }}>·</span>Trainer
      </a>
      <nav className="crumbs">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && <span className="sep">/</span>}
              {c.path && !isLast ? (
                <a href={`#${c.path}`} onClick={(e) => { e.preventDefault(); nav(c.path); }}>{c.label}</a>
              ) : (
                <span className={isLast ? 'current' : ''}>{c.label}</span>
              )}
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

// Mount
const __mount = document.getElementById('root');
ReactDOM.createRoot(__mount).render(<App />);
