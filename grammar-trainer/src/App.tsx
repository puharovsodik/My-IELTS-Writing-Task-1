import { useState, useEffect } from 'react'
import { Category } from './data'
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
