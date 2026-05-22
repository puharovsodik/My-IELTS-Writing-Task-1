type BandBadgeProps = {
  band: 6 | 7 | 8
}

export default function BandBadge({ band }: BandBadgeProps) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '1px 7px',
      borderRadius: 10,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.5px',
      background: `var(--band${band}-bg)`,
      color: `var(--band${band}-text)`,
      verticalAlign: 'middle',
      lineHeight: '16px',
    }}>
      B{band}
    </span>
  )
}
