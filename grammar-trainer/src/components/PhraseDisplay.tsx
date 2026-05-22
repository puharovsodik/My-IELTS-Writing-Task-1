import { getCharStatus } from '../utils/typing'

type PhraseDisplayProps = {
  phrase: string
  typed: string
  mode: 'basic' | 'memory'
}

export default function PhraseDisplay({ phrase, typed, mode }: PhraseDisplayProps) {
  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      fontSize: 22,
      lineHeight: 1.8,
      letterSpacing: '0.3px',
      userSelect: 'none',
    }}>
      {Array.from(phrase).map((char, i) => {
        const status = getCharStatus(typed, phrase, i)

        if (status === 'correct') {
          return <span key={i} style={{ color: 'var(--correct)' }}>{char}</span>
        }
        if (status === 'incorrect') {
          return <span key={i} style={{ color: 'var(--incorrect)' }}>{typed[i]}</span>
        }
        if (status === 'cursor') {
          return (
            <span key={i} style={{
              background: 'var(--cursor-bg)',
              color: 'white',
              borderRadius: 2,
              padding: '0 1px',
            }}>
              {char}
            </span>
          )
        }
        // pending
        return (
          <span key={i} style={{
            color: 'var(--pending)',
            opacity: mode === 'memory' ? 0 : 0.25,
          }}>
            {char}
          </span>
        )
      })}
    </div>
  )
}
