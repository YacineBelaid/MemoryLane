import { useEffect } from 'react'
import './App.css'
import Hero from './components/Hero'
import { Navigation } from './components/Navigation'
import { Flowbite } from 'flowbite-react'
import { Dashboard } from './pages/Dashboard'
import useUserStore from './store/useStore'

function App() {
  const { isAuthenticated, setIsAuthenticated } = useUserStore()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [setIsAuthenticated])

  return (
    <Flowbite>
      <section className='h-screen overflow-y-hidden bg-gradient-to-r from-[#141E30] from-200% via-blue-950 via-30% to-[#243B55] to-90% '>
        <Navigation authenticated={isAuthenticated} />
        {isAuthenticated ? <Dashboard /> : <Hero />}
      </section>
    </Flowbite>
  )
}

export default App