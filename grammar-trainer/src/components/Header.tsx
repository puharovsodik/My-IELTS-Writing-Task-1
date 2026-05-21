type HeaderProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
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
    </header>
  )
}
