type HeaderProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  shuffle: boolean
  onToggleShuffle: () => void
}

export default function Header({ theme, onToggleTheme, shuffle, onToggleShuffle }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-surface)',
    }}>
      <span style={{ fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.5px' }}>
        IELTS Grammar Trainer
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onToggleShuffle}
          style={{
            padding: '4px 14px',
            borderRadius: 20,
            border: shuffle ? 'none' : '1px solid var(--border)',
            background: shuffle ? 'var(--accent)' : 'transparent',
            color: shuffle ? 'white' : 'var(--text-muted)',
            fontSize: 13,
          }}
        >
          ⇄ Shuffle
        </button>
        <button
          onClick={onToggleTheme}
          style={{
            padding: '4px 14px',
            borderRadius: 20,
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: 13,
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  )
}
