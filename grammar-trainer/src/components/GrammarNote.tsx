import BandBadge from './BandBadge'

type GrammarNoteProps = {
  text: string
  band?: 6 | 7 | 8
}

export default function GrammarNote({ text, band }: GrammarNoteProps) {
  return (
    <div style={{
      fontSize: 12,
      color: 'var(--text-muted)',
      background: 'var(--bg-surface)',
      borderLeft: '3px solid var(--accent)',
      padding: '8px 14px',
      borderRadius: '0 6px 6px 0',
      lineHeight: 1.6,
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
    }}>
      {band && <BandBadge band={band} />}
      {text}
    </div>
  )
}
