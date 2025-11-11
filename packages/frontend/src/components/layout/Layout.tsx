/**
 * Layout Component - Main application layout with navigation
 */
import { Outlet, Link } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">
              Neural Network Builder
            </Link>
            <div className="flex gap-4">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <Link to="/architect" className="hover:underline">
                Architect
              </Link>
              <Link to="/dataset" className="hover:underline">
                Dataset
              </Link>
              <Link to="/train" className="hover:underline">
                Train
              </Link>
              <Link to="/evaluate" className="hover:underline">
                Evaluate
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
