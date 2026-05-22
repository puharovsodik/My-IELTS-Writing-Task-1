import { describe, it, expect } from 'vitest'
import { shuffled } from './array'

describe('shuffled', () => {
  it('returns an array of the same length', () => {
    expect(shuffled([1, 2, 3, 4, 5])).toHaveLength(5)
  })

  it('contains the same elements as the original', () => {
    const result = shuffled([1, 2, 3, 4, 5])
    expect([...result].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5])
  })

  it('does not mutate the original array', () => {
    const original = [1, 2, 3]
    shuffled(original)
    expect(original).toEqual([1, 2, 3])
  })

  it('handles empty array', () => {
    expect(shuffled([])).toEqual([])
  })
})
