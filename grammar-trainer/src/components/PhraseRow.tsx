import { getCharStatus } from '../utils/typing'
import GrammarNote from './GrammarNote'
import { Sentence } from '../data'

type PhraseRowProps = {
  sentence: Sentence
  typed: string
  isActive: boolean
  isDone: boolean
  mode: 'basic' | 'memory'
  index: number
  onClick: () => void
}

export default function PhraseRow({ sentence, typed, isActive, isDone, mode, index, onClick }: PhraseRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '32px 0',
        borderBottom: '1px solid var(--border)',
        cursor: isDone ? 'default' : 'text',
      }}
    >
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--text-subtle)',
        letterSpacing: '0.5px',
        textTransform: 'uppercase' as const,
        marginBottom: 12,
      }}>
        {String(index + 1).padStart(2, '0')}
        {isDone && <span style={{ marginLeft: 8, color: 'var(--accent)' }}>✓</span>}
      </div>

      <div style={{
        fontFamily: "'Georgia', serif",
        fontSize: 20,
        lineHeight: 1.8,
        letterSpacing: '0.3px',
        userSelect: 'none' as const,
        marginBottom: 16,
        opacity: isDone ? 0.55 : 1,
      }}>
        {Array.from(sentence.text).map((char, i) => {
          if (isDone) {
            return <span key={i} style={{ color: 'var(--accent)' }}>{char}</span>
          }
          const status = getCharStatus(typed, sentence.text, i)
          if (status === 'correct') {
            return <span key={i} style={{ color: 'var(--correct)' }}>{char}</span>
          }
          if (status === 'incorrect') {
            return <span key={i} style={{ color: 'var(--incorrect)' }}>{typed[i]}</span>
          }
          if (status === 'cursor') {
            return (
              <span key={i} style={{
                background: isActive ? 'var(--cursor-bg)' : 'transparent',
                color: isActive ? 'white' : 'var(--pending)',
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
              opacity: mode === 'memory' && isActive ? 0 : 1,
            }}>
              {char}
            </span>
          )
        })}
      </div>

      {sentence.grammar && (
        <GrammarNote text={sentence.grammar} band={sentence.band} />
      )}
    </div>
  )
}
