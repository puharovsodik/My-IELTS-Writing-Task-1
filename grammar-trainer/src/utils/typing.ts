export type CharStatus = 'correct' | 'incorrect' | 'cursor' | 'pending'

export function getCharStatus(typed: string, phrase: string, index: number): CharStatus {
  if (index < typed.length) {
    return typed[index] === phrase[index] ? 'correct' : 'incorrect'
  }
  if (index === typed.length) return 'cursor'
  return 'pending'
}

export function isComplete(typed: string, phrase: string): boolean {
  return typed === phrase
}
