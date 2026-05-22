type GrammarNoteProps = {
  text: string
}

export default function GrammarNote({ text }: GrammarNoteProps) {
  return (
    <div style={{
      fontSize: 12,
      color: 'var(--text-muted)',
      background: 'var(--bg-surface)',
      borderLeft: '3px solid var(--accent)',
      padding: '8px 14px',
      borderRadius: '0 6px 6px 0',
      lineHeight: 1.6,
    }}>
      {text}
    </div>
  )
}
