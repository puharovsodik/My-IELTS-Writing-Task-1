import { CATEGORIES, TASK1_CATEGORIES, Category } from '../data'

type CategorySelectorProps = {
  onSelect: (cat: Category) => void
}

function getBandRange(cat: Category): { min: 6 | 7 | 8; max: 6 | 7 | 8 } | null {
  const bands = cat.sentences
    .map(s => s.band)
    .filter((b): b is 6 | 7 | 8 => b === 6 || b === 7 || b === 8)
  if (!bands.length) return null
  return { min: Math.min(...bands) as 6 | 7 | 8, max: Math.max(...bands) as 6 | 7 | 8 }
}

function BandTag({ cat }: { cat: Category }) {
  const range = getBandRange(cat)
  if (!range) return null
  const label = range.min === range.max ? `B${range.min}` : `B${range.min}–B${range.max}`
  return <span className={`band-tag b${range.max}`}>{label}</span>
}

function CategoryCard({ cat, onSelect }: { cat: Category; onSelect: (cat: Category) => void }) {
  return (
    <button className="card" onClick={() => onSelect(cat)} aria-label={`Start ${cat.name}, ${cat.sentences.length} phrases`}>
      <span className="card-icon" aria-hidden>{cat.icon}</span>
      <div className="card-body">
        <span className="card-title">{cat.name}</span>
        <span className="card-meta">
          <span>{cat.sentences.length} phrases</span>
          <span className="card-meta-dot" aria-hidden />
          <BandTag cat={cat} />
        </span>
      </div>
    </button>
  )
}

function Section({ title, count, categories, onSelect }: {
  title: string
  count: number
  categories: Category[]
  onSelect: (cat: Category) => void
}) {
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">{title}</h2>
        <span className="section-count">{count} sets</span>
      </div>
      <div className="cat-grid">
        {categories.map(cat => (
          <CategoryCard key={cat.id} cat={cat} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}

export default function CategorySelector({ onSelect }: CategorySelectorProps) {
  const allCategories = [...CATEGORIES, ...TASK1_CATEGORIES]
  const totalPhrases = allCategories.reduce((sum, c) => sum + c.sentences.length, 0)
  const totalCategories = allCategories.length

  return (
    <main className="shell">
      <section className="hero">
        <span className="hero-eyebrow">
          <span className="hero-dot" aria-hidden />
          Shadow typing trainer
        </span>
        <h1 className="hero-title">
          Build automaticity for <em>IELTS Writing</em>.
        </h1>
        <p className="hero-desc">
          Type C1–C2 grammar structures and Writing Task 1 vocabulary until they become muscle memory. Shadow over faint text, see your own mistakes, repeat until clean.
        </p>
        <ul className="hero-stats">
          <li>
            <span className="stat-num">{totalPhrases}</span>
            <span className="stat-label">Phrases</span>
          </li>
          <li>
            <span className="stat-num">{totalCategories}</span>
            <span className="stat-label">Categories</span>
          </li>
          <li>
            <span className="stat-num">B6 · B7 · B8</span>
            <span className="stat-label">Bands covered</span>
          </li>
        </ul>
      </section>

      <Section
        title="Grammar Structures"
        count={CATEGORIES.length}
        categories={CATEGORIES}
        onSelect={onSelect}
      />
      <Section
        title="Writing Task 1"
        count={TASK1_CATEGORIES.length}
        categories={TASK1_CATEGORIES}
        onSelect={onSelect}
      />
    </main>
  )
}
