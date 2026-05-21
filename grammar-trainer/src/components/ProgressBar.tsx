type ProgressBarProps = {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div style={{
      height: 3,
      background: 'var(--accent-soft)',
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`,
        height: '100%',
        background: 'var(--accent)',
        borderRadius: 2,
        transition: 'width 0.3s ease',
      }} />
    </div>
  )
}
