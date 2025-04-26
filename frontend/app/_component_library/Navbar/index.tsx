'use client'
import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className="w-60 border-r border-gray-800">
    <div className="p-5 border-b border-gray-800">
      <h2 className="text-xl font-semibold text-gray-400">TRADING</h2>
    </div>
    <nav className="py-4">
      <ul>
        <li className="mb-2">
          <Link
            href="/dashboard"
            className="block px-5 py-2 bg-gray-900 text-white font-medium"
          >
            Dashboard
          </Link>
        </li>
        <li className="mb-2">
          <Link
            href="/markets"
            className="block px-5 py-2 text-gray-400 hover:bg-gray-800"
          >
            Markets
          </Link>
        </li>
        <li className="mb-2">
          <Link
            href="/portfolio"
            className="block px-5 py-2 text-gray-400 hover:bg-gray-800"
          >
            Portfolio
          </Link>
        </li>
        <li className="mb-2">
          <Link
            href="/history"
            className="block px-5 py-2 text-gray-400 hover:bg-gray-800"
          >
            History
          </Link>
        </li>
      </ul>
    </nav>
  </div>
  )
}

export default Navbar