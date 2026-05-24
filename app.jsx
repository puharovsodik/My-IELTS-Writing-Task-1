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

// ── HomeScreen ────────────────────────────────────────────────────────────
function HomeScreen() {
  const data = window.IELTS_DATA;
  const guidebook = data.domains.find(d => d.id === 'guidebook');
  const grammarCats = window.SHADOW_DATA.grammar.categories;
  const practiceCats = window.SHADOW_DATA.practice.categories;

  const domains = [
    {
      id: 'guidebook',
      kicker: guidebook.kicker,
      namePrefix: 'Guide', nameSuffix: 'book',
      tagline: guidebook.tagline,
      items: guidebook.groups.map(g => ({
        label: g.title,
        meta: g.topics ? `${g.topics.length} topics` : g.meta,
      })),
      index: '01 / 03',
      cta: 'Enter Guidebook',
    },
    {
      id: 'grammar',
      kicker: 'Shadow Typing',
      namePrefix: 'Gram', nameSuffix: 'mar',
      tagline: 'C1–C2 structures — type until the form is automatic',
      items: grammarCats.map(c => ({ label: c.title, meta: `${c.sentences.length} phrases` })),
      index: '02 / 03',
      cta: 'Enter Grammar',
    },
    {
      id: 'practice',
      kicker: 'Shadow Typing',
      namePrefix: 'Prac', nameSuffix: 'tice',
      tagline: 'Task 1 vocabulary and sentence patterns, B6–B8',
      items: [
        ...practiceCats.slice(0, 5).map(c => ({ label: c.title, meta: `${c.sentences.length} phrases` })),
        { label: `+ ${practiceCats.length - 5} more`, meta: '' },
      ],
      index: '03 / 03',
      cta: 'Enter Practice',
    },
  ];

  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__eyebrow">
          <span className="home__eyebrow-dot" />
          IELTS Writing Trainer
        </div>
        <h1 className="home__title">
          Three disciplines.<br />
          One <em>examiner</em> standard.
        </h1>
        <p className="home__lede">
          Master the structure, then drill the muscle.{' '}
          <em className="lede-em lede-em--g">Guidebook</em> is the reference;{' '}
          <em className="lede-em lede-em--gr">Grammar</em> and{' '}
          <em className="lede-em lede-em--p">Practice</em> are where reps happen.
        </p>
      </div>

      <div className="home__cards">
        {domains.map(d => (
          <a
            key={d.id}
            className="home-card"
            data-domain={d.id}
            href={`#/${d.id}`}
            onClick={e => { e.preventDefault(); nav(`/${d.id}`); }}
          >
            <div className="home-card__bg" />
            <div className="home-card__inner">
              <div className="home-card__top">
                <span className="eyebrow">{d.kicker}</span>
                <span className="home-card__index">{d.index}</span>
              </div>
              <h2 className="home-card__name">
                <b>{d.namePrefix}</b>{d.nameSuffix}<span className="dot">.</span>
              </h2>
              <p className="home-card__tag">{d.tagline}</p>
              <div className="home-card__contents">
                <div className="home-card__contents-label">Contains</div>
                <ul className="home-card__list">
                  {d.items.map((item, i) => (
                    <li key={i}>
                      <span className="home-card__bullet" />
                      <span>{item.label}</span>
                      {item.meta && <span className="home-card__meta">{item.meta}</span>}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="home-card__cta">
                {d.cta}
                <span className="arrow">→</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
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
    screen = <HomeScreen />;
  } else if (route[0] === 'grammar' || route[0] === 'practice') {
    chromeProps.domainId = route[0];
    if (route.length === 1) {
      screen = <ShadowCategorySelector domainId={route[0]} />;
    } else if (route.length === 2) {
      screen = <ShadowTypingPage domainId={route[0]} categoryId={route[1]} />;
    } else {
      screen = <NotFound />;
    }
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
      screen = <NotFound />;
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
  const isShadowDomain = route[0] === 'grammar' || route[0] === 'practice';

  if (isShadowDomain) {
    const shadowDomain = window.SHADOW_DATA[route[0]];
    crumbs.push({ label: shadowDomain.title, path: `/${route[0]}`, domain: route[0] });
    if (route[1]) {
      const cat = shadowDomain.categories.find(c => c.id === route[1]);
      crumbs.push({ label: cat ? cat.title : route[1], path: null, domain: route[0] });
    }
  } else {
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
        const top = grp && grp.topics && grp.topics.find((t) => t.id === route[2]);
        if (top) label = top.title;
      }
      crumbs.push({ label, path: null, domain: route[0] });
    }
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
