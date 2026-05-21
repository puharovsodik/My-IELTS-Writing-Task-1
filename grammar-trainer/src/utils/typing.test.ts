import { describe, it, expect } from 'vitest'
import { getCharStatus, isComplete } from './typing'

describe('getCharStatus', () => {
  const phrase = 'hello'

  it('returns correct when typed char matches', () => {
    expect(getCharStatus('h', phrase, 0)).toBe('correct')
  })

  it('returns incorrect when typed char does not match', () => {
    expect(getCharStatus('x', phrase, 0)).toBe('incorrect')
  })

  it('returns cursor at the current typing position', () => {
    expect(getCharStatus('h', phrase, 1)).toBe('cursor')
  })

  it('returns pending for untyped positions beyond cursor', () => {
    expect(getCharStatus('h', phrase, 2)).toBe('pending')
  })

  it('returns cursor at index 0 when nothing typed', () => {
    expect(getCharStatus('', phrase, 0)).toBe('cursor')
  })

  it('returns pending at index 1 when nothing typed', () => {
    expect(getCharStatus('', phrase, 1)).toBe('pending')
  })
})

describe('isComplete', () => {
  it('returns true when typed matches phrase exactly', () => {
    expect(isComplete('hello', 'hello')).toBe(true)
  })

  it('returns false when typed is shorter than phrase', () => {
    expect(isComplete('hell', 'hello')).toBe(false)
  })

  it('returns false when any character differs', () => {
    expect(isComplete('hellx', 'hello')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isComplete('', 'hello')).toBe(false)
  })
})
