import { useState, useEffect, useCallback } from 'react'
import { Category } from '../data'
import { isComplete } from '../utils/typing'
import PhraseDisplay from './PhraseDisplay'
import ModeToggle from './ModeToggle'
import ProgressBar from './ProgressBar'
import GrammarNote from './GrammarNote'

type TypingAreaProps = {
  category: Category
  onComplete: () => void
  onBack: () => void
}

export default function TypingArea({ category, onComplete, onBack }: TypingAreaProps) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [mode, setMode] = useState<'basic' | 'memory'>('basic')
  const [success, setSuccess] = useState(false)

  const phrase = category.sentences[phraseIndex]

  // Detect completion
  useEffect(() => {
    if (typed.length > 0 && isComplete(typed, phrase.text)) {
      setSuccess(true)
      const timer = setTimeout(() => {
        const next = phraseIndex + 1
        if (next >= category.sentences.length) {
          onComplete()
        } else {
          setPhraseIndex(next)
        }
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [typed, phrase.text, phraseIndex, category.sentences.length, onComplete])

  // Reset state when phrase advances
  useEffect(() => {
    setTyped('')
    setSuccess(false)
  }, [phraseIndex])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (success) return

    if (e.key === 'Tab') {
      e.preventDefault()
      setMode(m => m === 'basic' ? 'memory' : 'basic')
      return
    }

    if (e.key === 'Backspace') {
      setTyped(t => t.slice(0, -1))
      return
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setTyped(t => t.length < phrase.text.length ? t + e.key : t)
    }
  }, [success, phrase.text.length])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 48px' }}>
      {/* Nav row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, padding: 0 }}
        >
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {category.icon} {category.name}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {phraseIndex + 1} / {category.sentences.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 32 }}>
        <ProgressBar current={phraseIndex} total={category.sentences.length} />
      </div>

      {/* Phrase display */}
      <div style={{
        marginBottom: 20,
        padding: 24,
        background: success ? 'var(--accent-soft)' : 'var(--bg-surface)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        transition: 'background 0.3s',
      }}>
        <PhraseDisplay phrase={phrase.text} typed={typed} mode={mode} />
      </div>

      {/* Grammar note */}
      {phrase.grammar && (
        <div style={{ marginBottom: 24 }}>
          <GrammarNote text={phrase.grammar} />
        </div>
      )}

      {/* Mode toggle */}
      <ModeToggle
        mode={mode}
        onToggle={() => setMode(m => m === 'basic' ? 'memory' : 'basic')}
      />

      {success && (
        <p style={{ marginTop: 16, color: 'var(--accent)', fontSize: 14, fontWeight: 600 }}>
          ✓ Correct! Moving to next phrase…
        </p>
      )}
    </main>
  )
}
