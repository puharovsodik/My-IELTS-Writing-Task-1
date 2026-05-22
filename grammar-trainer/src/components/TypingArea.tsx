import { useState, useEffect, useCallback, useRef } from 'react'
import { Category, Sentence } from '../data'
import { isComplete } from '../utils/typing'
import { nextQueueState } from '../utils/queue'
import PhraseDisplay from './PhraseDisplay'
import ModeToggle from './ModeToggle'
import ProgressBar from './ProgressBar'
import GrammarNote from './GrammarNote'
import BandBadge from './BandBadge'

type TypingAreaProps = {
  category: Category
  sentences: Sentence[]
  onComplete: () => void
  onBack: () => void
}

export default function TypingArea({ category, sentences, onComplete, onBack }: TypingAreaProps) {
  const [queue, setQueue] = useState<Sentence[]>(sentences)
  const [queueIndex, setQueueIndex] = useState(0)
  const [originalTotal] = useState(sentences.length)
  const [typed, setTyped] = useState('')
  const [mode, setMode] = useState<'basic' | 'memory'>('basic')
  const [success, setSuccess] = useState(false)

  const phraseHadErrorRef = useRef(false)
  const phrase = queue[queueIndex]
  const isRetrying = queue.length > originalTotal

  // Detect completion and advance queue
  useEffect(() => {
    if (typed.length > 0 && isComplete(typed, phrase.text)) {
      setSuccess(true)
      const capturedQueue = queue
      const capturedIndex = queueIndex
      const capturedHadError = phraseHadErrorRef.current

      const timer = setTimeout(() => {
        const result = nextQueueState(capturedQueue, capturedIndex, capturedHadError)
        if (result.done) {
          onComplete()
        } else {
          setQueue(result.queue)
          setQueueIndex(result.index)
        }
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [typed, phrase.text, queue, queueIndex, onComplete])

  // Reset on phrase change
  useEffect(() => {
    setTyped('')
    setSuccess(false)
    phraseHadErrorRef.current = false
  }, [queueIndex])

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
      setTyped(t => {
        if (t.length >= phrase.text.length) return t
        if (e.key !== phrase.text[t.length]) {
          phraseHadErrorRef.current = true
        }
        return t + e.key
      })
    }
  }, [success, phrase.text])

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {category.icon} {category.name}
          </span>
          <span style={{
            fontSize: 13,
            color: isRetrying ? 'var(--incorrect)' : 'var(--text-muted)',
          }}>
            {queueIndex + 1} / {queue.length}
          </span>
          {phrase.band && <BandBadge band={phrase.band} />}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 32 }}>
        <ProgressBar current={queueIndex} total={queue.length} />
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
          <GrammarNote text={phrase.grammar} band={phrase.band} />
        </div>
      )}

      {/* Mode toggle */}
      <ModeToggle
        mode={mode}
        onToggle={() => setMode(m => m === 'basic' ? 'memory' : 'basic')}
      />

      {success && (
        <p style={{ marginTop: 16, color: 'var(--accent)', fontSize: 14, fontWeight: 600 }}>
          {phraseHadErrorRef.current ? '↩ Had errors — will retry later' : '✓ Correct! Moving to next phrase…'}
        </p>
      )}
    </main>
  )
}
