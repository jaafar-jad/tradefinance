"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa'
import { authenticateUser } from '@/services/auth/authService'
import toast, { Toaster } from 'react-hot-toast'
import Head from 'next/head'

export default function Login() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)

  // Clear errors when input changes
  useEffect(() => {
    setErrors({})
  }, [formData])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        const user = await authenticateUser(formData.email, formData.password)
        
        if (!user) {
          throw new Error('Invalid credentials')
        }

        // Reset login attempts on successful login
        setLoginAttempts(0)
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(user))
        
        toast.success('Login successful! Redirecting...')
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/dashboard/${user.id}`)
        }, 1500)

      } catch (error) {
        setLoginAttempts(prev => prev + 1)
        
        if (loginAttempts >= 2) {
          toast.error('Multiple failed attempts detected. Please try again later or reset your password.')
        } else {
          toast.error(error.message || 'Invalid email or password')
        }
        
        setErrors({ 
          submit: 'Please check your credentials and try again'
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const ErrorMessage = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-red-50 text-red-500 p-4 rounded-lg flex items-center justify-between"
    >
      <span>{message}</span>
      <button 
        onClick={() => setErrors({})}
        className="text-red-400 hover:text-red-600"
      >
        <FaTimes />
      </button>
    </motion.div>
  )

  return (
    <>
      <Head>
        <title>Login | Trade Finance - Access Your Trading Dashboard</title>
        <meta name="description" content="Securely access your Trade Finance trading dashboard. Monitor your investments, track performance, and manage your trading portfolio." />
        
        {/* Open Graph */}
        <meta property="og:title" content="Login to Trade Finance" />
        <meta property="og:description" content="Access your secure trading dashboard on Trade Finance platform." />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Trade Finance Login" />
        <meta name="twitter:description" content="Secure login to your Trade Finance trading dashboard." />
        
        {/* Security */}
        <meta name="robots" content="noindex, nofollow" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
        
        {/* PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="canonical" href="https://tradefinancetf.com/auth/login" />
      </Head>

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-black to-red-900">
    <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: '#1F2937',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px'
        }
      }} 
    />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4 py-20 h-[100vh] relative z-10"
      >
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
          <h1 className="text-3xl font-bold  mb-2">Welcome Back</h1>
          <p className="text-gray-400">Access Your Trading Dashboard</p>
          </div>

          {errors.submit && (
            <AnimatePresence>
              <ErrorMessage message={errors.submit} />
            </AnimatePresence>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Email Address
  </label>
  <div className="relative">
    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="email"
      value={formData.email}
      onChange={(e) => setFormData({...formData, email: e.target.value})}
      className={`w-full pl-10 pr-4 py-3 rounded-lg border 
        ${errors.email ? 'border-red-500' : 'border-gray-300'}
        focus:ring-2 focus:ring-red-500 focus:border-transparent 
        transition-all duration-200
        text-gray-900 font-medium
        placeholder:text-gray-400`}
      placeholder="Enter your email"
      disabled={isLoading}
    />
  </div>
  {errors.email && (
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-1 text-sm text-red-500"
    >
      {errors.email}
    </motion.p>
  )}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Password
  </label>
  <div className="relative">
    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type={showPassword ? 'text' : 'password'}
      value={formData.password}
      onChange={(e) => setFormData({...formData, password: e.target.value})}
      className={`w-full pl-10 pr-12 py-3 rounded-lg border 
        ${errors.password ? 'border-red-500' : 'border-gray-300'}
        focus:ring-2 focus:ring-red-500 focus:border-transparent 
        transition-all duration-200
        text-gray-900 font-medium
        placeholder:text-gray-400`}
      placeholder="Enter your password"
      disabled={isLoading}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      disabled={isLoading}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
  {errors.password && (
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-1 text-sm text-red-500"
    >
      {errors.password}
    </motion.p>
  )}
</div>


            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <div
                className="text-sm text-red-600 hover:text-red-500 transition-colors duration-200"
              >
                Forgot password?
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold
                hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
                transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-red-600 hover:text-red-500 font-semibold transition-colors duration-200">
              Sign up now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
    </>
  )
}
