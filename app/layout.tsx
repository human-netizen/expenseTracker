import "./globals.css"
import { Inter } from "next/font/google"
import { AppProvider } from "./context/AppContext"
import Navbar from "./components/Navbar"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Expense Tracker",
  description: "Track expenses for Niloy and Sejuti",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <AppProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </AppProvider>
      </body>
    </html>
  )
}

