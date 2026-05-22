import { Sentence } from '../data'

export function nextQueueState(
  queue: Sentence[],
  index: number,
  hadError: boolean
): { queue: Sentence[]; index: number; done: boolean } {
  const nextQueue = hadError ? [...queue, queue[index]] : queue
  const nextIndex = index + 1
  return {
    queue: nextQueue,
    index: nextIndex,
    done: nextIndex >= nextQueue.length,
  }
}
