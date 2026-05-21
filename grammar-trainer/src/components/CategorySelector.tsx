import { CATEGORIES, Category } from '../data'

type CategorySelectorProps = {
  onSelect: (cat: Category) => void
}

export default function CategorySelector({ onSelect }: CategorySelectorProps) {
  return (
    <main style={{ maxWidth: 720, margin: '48px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8, color: 'var(--text)' }}>
        Choose a grammar category
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 14 }}>
        Type each phrase to practise IELTS C1–C2 structures
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16,
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = 'var(--accent)'
              el.style.background = 'var(--accent-soft)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = 'var(--border)'
              el.style.background = 'var(--bg-surface)'
            }}
            style={{
              padding: '24px 20px',
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              color: 'var(--text)',
              textAlign: 'left',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{cat.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{cat.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              {cat.sentences.length} phrases
            </div>
          </button>
        ))}
      </div>
    </main>
  )
}
