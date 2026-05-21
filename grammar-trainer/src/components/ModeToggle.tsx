type ModeToggleProps = {
  mode: 'basic' | 'memory'
  onToggle: () => void
}

export default function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {(['basic', 'memory'] as const).map(m => (
        <button
          key={m}
          onClick={onToggle}
          style={{
            padding: '6px 16px',
            borderRadius: 20,
            border: mode === m ? 'none' : '1px solid var(--border)',
            background: mode === m ? 'var(--accent)' : 'transparent',
            color: mode === m ? 'white' : 'var(--text-muted)',
            fontSize: 12,
            textTransform: 'capitalize',
          }}
        >
          {m}
        </button>
      ))}
      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>
        Tab ↹
      </span>
    </div>
  )
}
