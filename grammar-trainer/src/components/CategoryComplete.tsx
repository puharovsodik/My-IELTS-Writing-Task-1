import { Category } from '../data'

type CategoryCompleteProps = {
  category: Category
  onBack: () => void
}

export default function CategoryComplete({ category, onBack }: CategoryCompleteProps) {
  return (
    <main style={{
      maxWidth: 480,
      margin: '80px auto',
      padding: '48px 32px',
      textAlign: 'center',
      background: 'var(--bg-surface)',
      borderRadius: 16,
      border: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Category complete!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
        You typed all {category.sentences.length} phrases in{' '}
        <strong style={{ color: 'var(--accent)' }}>{category.name}</strong>.
        Keep practising to build muscle memory.
      </p>
      <button
        onClick={onBack}
        style={{
          padding: '10px 28px',
          borderRadius: 24,
          border: 'none',
          background: 'var(--accent)',
          color: 'white',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Choose another category
      </button>
    </main>
  )
}
