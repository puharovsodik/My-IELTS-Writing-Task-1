type HeaderProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  shuffle: boolean
  onToggleShuffle: () => void
}

export default function Header({ theme, onToggleTheme, shuffle, onToggleShuffle }: HeaderProps) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 24px',
      borderBottom: '1px solid var(--border)',
      background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
      backdropFilter: 'saturate(180%) blur(12px)',
      WebkitBackdropFilter: 'saturate(180%) blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          aria-hidden
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: 'linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)',
            boxShadow: '0 2px 8px var(--ring)',
          }}
        />
        <span style={{
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: '-0.005em',
          color: 'var(--text-strong)',
        }}>
          IELTS Trainer
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          className="pill"
          onClick={onToggleShuffle}
          data-active={shuffle}
          aria-pressed={shuffle}
          title="Toggle shuffle order"
        >
          <span aria-hidden>⇄</span>
          Shuffle
        </button>
        <button
          type="button"
          className="pill"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          <span aria-hidden>{theme === 'light' ? '🌙' : '☀️'}</span>
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  )
}
