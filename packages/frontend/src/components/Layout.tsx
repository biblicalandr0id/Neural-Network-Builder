import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import {
  LayoutGrid,
  Database,
  Play,
  BarChart3,
  Home,
  Github,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function Layout() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Architect', href: '/architect', icon: LayoutGrid },
    { name: 'Datasets', href: '/dataset', icon: Database },
    { name: 'Training', href: '/train', icon: Play },
    { name: 'Evaluation', href: '/evaluate', icon: BarChart3 },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="flex h-16 items-center px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              🧠
            </div>
            <span>Neural Network Builder</span>
          </Link>

          <nav className="ml-10 flex gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/biblicalandr0id/Neural-Network-Builder"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
