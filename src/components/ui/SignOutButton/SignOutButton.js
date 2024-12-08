"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function SignOutButton() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem('authToken')
    sessionStorage.clear()
    router.push('/auth/login')
  }

  return (
    <>
      <button 
        onClick={() => setShowConfirmation(true)} 
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        Sign out
      </button>

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-sm mx-4"
            >
              <h3 className="text-lg font-semibold mb-2">Sign Out</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to sign out?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
