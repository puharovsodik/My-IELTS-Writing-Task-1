import { useState, useEffect } from 'react'
import { Category, Sentence } from './data'
import { shuffled } from './utils/array'
import Header from './components/Header'
import CategorySelector from './components/CategorySelector'
import TypingArea from './components/TypingArea'
import CategoryComplete from './components/CategoryComplete'

type Screen = 'categories' | 'typing' | 'complete'

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  const [screen, setScreen] = useState<Screen>('categories')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [activeSentences, setActiveSentences] = useState<Sentence[]>([])
  const [shuffle, setShuffle] = useState(false)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  function toggleShuffle() {
    setShuffle(s => !s)
  }

  function selectCategory(cat: Category) {
    const sentences = shuffle ? shuffled(cat.sentences) : [...cat.sentences]
    setActiveSentences(sentences)
    setSelectedCategory(cat)
    setScreen('typing')
  }

  function completeCategory() {
    setScreen('complete')
  }

  function goBack() {
    setScreen('categories')
    setSelectedCategory(null)
  }

  return (
    <div>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        shuffle={shuffle}
        onToggleShuffle={toggleShuffle}
      />
      {screen === 'categories' && (
        <CategorySelector onSelect={selectCategory} />
      )}
      {screen === 'typing' && selectedCategory && (
        <TypingArea
          category={selectedCategory}
          sentences={activeSentences}
          onComplete={completeCategory}
          onBack={goBack}
        />
      )}
      {screen === 'complete' && selectedCategory && (
        <CategoryComplete category={selectedCategory} onBack={goBack} />
      )}
    </div>
  )
}
