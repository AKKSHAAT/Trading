import React from 'react'

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-60">
      <span className="block w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
    </div>
  )
}

export default Loader