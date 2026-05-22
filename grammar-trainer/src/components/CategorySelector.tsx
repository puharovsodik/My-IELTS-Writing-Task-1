import { CATEGORIES, TASK1_CATEGORIES, Category } from '../data'

type CategorySelectorProps = {
  onSelect: (cat: Category) => void
}

function CategoryGrid({ categories, onSelect }: { categories: Category[]; onSelect: (cat: Category) => void }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 14,
    }}>
      {categories.map(cat => (
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
            padding: '20px 16px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--bg-surface)',
            color: 'var(--text)',
            textAlign: 'left',
            transition: 'border-color 0.15s, background 0.15s',
          }}
        >
          <div style={{ fontSize: 26, marginBottom: 8 }}>{cat.icon}</div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{cat.name}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>
            {cat.sentences.length} phrases
          </div>
        </button>
      ))}
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      color: 'var(--text-muted)',
      marginBottom: 14,
    }}>
      {children}
    </div>
  )
}

export default function CategorySelector({ onSelect }: CategorySelectorProps) {
  return (
    <main style={{ maxWidth: 760, margin: '40px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6, color: 'var(--text)' }}>
        Choose a category
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: 13 }}>
        Type each phrase to build automaticity with IELTS C1–C2 structures
      </p>

      <div style={{ marginBottom: 36 }}>
        <SectionLabel>Grammar Structures</SectionLabel>
        <CategoryGrid categories={CATEGORIES} onSelect={onSelect} />
      </div>

      <div>
        <SectionLabel>Writing Task 1</SectionLabel>
        <CategoryGrid categories={TASK1_CATEGORIES} onSelect={onSelect} />
      </div>
    </main>
  )
}
