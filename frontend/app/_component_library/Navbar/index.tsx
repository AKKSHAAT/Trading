'use client'
import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className="w-60 border-r border-gray-800 h-full flex flex-col">
      <div className="p-5 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-gray-400">TRADING</h2>
      </div>
      <nav className="flex-1 flex flex-col">
        <ul className='flex flex-col h-full'>
          <li className="mb-2 ">
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
          <li className='mt-auto'>
            <button
              className="w-full text-left block px-5 py-2 text-red-400 hover:bg-gray-800"
              onClick={async () => {
                const { signOut } = await import("supertokens-auth-react/recipe/session");
                await signOut();
                window.location.href = "/auth";
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar