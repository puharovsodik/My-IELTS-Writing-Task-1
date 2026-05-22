import { describe, it, expect } from 'vitest'
import { nextQueueState } from './queue'

const s = (text: string) => ({ text })

describe('nextQueueState', () => {
  it('advances index without error, queue unchanged', () => {
    const q = [s('a'), s('b'), s('c')]
    const result = nextQueueState(q, 0, false)
    expect(result.queue).toHaveLength(3)
    expect(result.index).toBe(1)
    expect(result.done).toBe(false)
  })

  it('appends current sentence to queue on error', () => {
    const q = [s('a'), s('b')]
    const result = nextQueueState(q, 0, true)
    expect(result.queue).toHaveLength(3)
    expect(result.queue[2]).toEqual(s('a'))
    expect(result.index).toBe(1)
    expect(result.done).toBe(false)
  })

  it('marks done when last sentence completed without error', () => {
    const q = [s('a'), s('b')]
    const result = nextQueueState(q, 1, false)
    expect(result.done).toBe(true)
  })

  it('does not mark done when last sentence had error (appended)', () => {
    const q = [s('a'), s('b')]
    const result = nextQueueState(q, 1, true)
    expect(result.done).toBe(false)
    expect(result.queue).toHaveLength(3)
    expect(result.index).toBe(2)
  })

  it('marks done after working through retry queue', () => {
    const q = [s('a'), s('b'), s('a')]  // s('a') was retried once
    const result = nextQueueState(q, 2, false)
    expect(result.done).toBe(true)
  })
})
