'use client'

import Link from 'next/link'
import { useAppContext } from '../context/AppContext'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { user, logout } = useAppContext()
  const pathname = usePathname()

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/history', label: 'History', icon: '📅' }
  ]

  if (user?.username === 'niloy') {
    navLinks.push({ href: '/personal/niloy', label: 'Personal', icon: '👤' })
  }
  if (user?.username === 'sejuti') {
    navLinks.push({ href: '/personal/sejuti', label: 'Personal', icon: '👤' })
  }

  return (
    <div className="bg-white shadow-lg">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 text-center text-sm">
        💡 Track your expenses smartly and save more!
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl mr-2">💰</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ExpenseTracker
              </span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-6">
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      pathname === link.href 
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.username}
                  </span>
                </div>
                <button 
                  onClick={logout} 
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center"
                >
                  <span className="mr-2">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
