import { useState, useEffect, useRef } from 'react'
import { Category, Sentence } from '../data'
import { isComplete } from '../utils/typing'
import PhraseRow from './PhraseRow'
import ModeToggle from './ModeToggle'

type DocumentViewProps = {
  category: Category
  sentences: Sentence[]
  onComplete: () => void
  onBack: () => void
}

export default function DocumentView({ category, sentences, onComplete, onBack }: DocumentViewProps) {
  const [activePhraseIndex, setActivePhraseIndex] = useState<number | null>(null)
  const [phraseInputs, setPhraseInputs] = useState<string[]>(() => sentences.map(() => ''))
  const [completedPhrases, setCompletedPhrases] = useState<Set<number>>(new Set())
  const [mode, setMode] = useState<'basic' | 'memory'>('basic')

  // Refs let the keydown handler always read latest values without re-registering on every keystroke
  const activeRef = useRef<number | null>(null)
  const inputsRef = useRef<string[]>(sentences.map(() => ''))
  const completedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const i = activeRef.current
      if (i === null || completedRef.current.has(i)) return

      if (e.key === 'Tab') {
        e.preventDefault()
        setMode(m => m === 'basic' ? 'memory' : 'basic')
        return
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (e.key === 'Backspace') {
        inputsRef.current = inputsRef.current.map((t, idx) => idx === i ? t.slice(0, -1) : t)
        setPhraseInputs([...inputsRef.current])
        return
      }

      if (e.key.length === 1) {
        const newTyped = inputsRef.current[i] + e.key
        inputsRef.current = inputsRef.current.map((t, idx) => idx === i ? newTyped : t)
        setPhraseInputs([...inputsRef.current])

        if (isComplete(newTyped, sentences[i].text)) {
          const newSet = new Set(completedRef.current)
          newSet.add(i)
          completedRef.current = newSet
          setCompletedPhrases(newSet)
          if (newSet.size === sentences.length) setTimeout(onComplete, 600)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sentences, onComplete])

  function handlePhraseClick(i: number) {
    if (completedRef.current.has(i)) return
    activeRef.current = i
    setActivePhraseIndex(i)
  }

  return (
    <div>
      {/* Sub-nav: back, category name, mode toggle, progress */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '5px 12px',
              background: 'var(--bg-surface)',
              cursor: 'pointer',
            }}
          >
            ← Назад
          </button>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
            {category.icon} {category.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ModeToggle mode={mode} onToggle={() => setMode(m => m === 'basic' ? 'memory' : 'basic')} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{completedPhrases.size}</span>
            {' / '}{sentences.length}
          </span>
        </div>
      </div>

      {/* Document body */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 32px 80px' }}>
        {sentences.map((sentence, i) => (
          <PhraseRow
            key={i}
            sentence={sentence}
            typed={phraseInputs[i]}
            isActive={activePhraseIndex === i}
            isDone={completedPhrases.has(i)}
            mode={mode}
            index={i}
            onClick={() => handlePhraseClick(i)}
          />
        ))}
      </div>
    </div>
  )
}
