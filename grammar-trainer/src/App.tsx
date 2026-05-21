import { useState } from 'react'
import { Category } from './data'
import Header from './components/Header'
import CategorySelector from './components/CategorySelector'
import TypingArea from './components/TypingArea'
import CategoryComplete from './components/CategoryComplete'

type Screen = 'categories' | 'typing' | 'complete'

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [screen, setScreen] = useState<Screen>('categories')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : '')
  }

  function selectCategory(cat: Category) {
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
      <Header theme={theme} onToggleTheme={toggleTheme} />
      {screen === 'categories' && (
        <CategorySelector onSelect={selectCategory} />
      )}
      {screen === 'typing' && selectedCategory && (
        <TypingArea
          category={selectedCategory}
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
