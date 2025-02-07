"use client"

import Link from "next/link"
import { useAppContext } from "../context/AppContext"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { user, logout } = useAppContext()
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Expense Tracker
          </Link>
          {user && (
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className={`text-sm ${
                  pathname === "/dashboard" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/history"
                className={`text-sm ${pathname === "/history" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
              >
                History
              </Link>
              <button onClick={logout} className="text-sm text-gray-600 hover:text-blue-600">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

