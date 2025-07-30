"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

const CORRECT_PASSWORD = "1234" // Change this to your desired 4-digit password

// Inline keyframe animations as style objects
const animations = {
  pulse: {
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  },
  fadeIn: {
    animation: "fadeIn 1s ease-out",
  },
  slideDown: {
    animation: "slideDown 0.8s ease-out",
  },
  slideUp: {
    animation: "slideUp 0.8s ease-out 0.3s both",
  },
  fadeInDelayed: {
    animation: "fadeIn 1s ease-out 0.6s both",
  },
  shake: {
    animation: "shake 0.5s ease-in-out",
  },
}

// CSS keyframes as a style tag
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
  }
`

// Lock Icon Component
const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
)

// Unlock Icon Component
const UnlockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
    />
  </svg>
)

// Arrow Right Icon Component
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

// PDF Icon Component
const PdfIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

// Finance Icon Component
const FinanceIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export default function Home() {
  const [password, setPassword] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isWrongPassword, setIsWrongPassword] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus the input when component mounts
  useEffect(() => {
    if (inputRef.current && !showContent) {
      inputRef.current.focus()
    }
  }, [showContent])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4) // Only allow digits, max 4
    setPassword(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length === 4) {
      if (password === CORRECT_PASSWORD) {
        setIsUnlocked(true)
        setTimeout(() => {
          setShowContent(true)
        }, 800)
      } else {
        setIsWrongPassword(true)
        setTimeout(() => {
          setPassword("")
          setIsWrongPassword(false)
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }, 1000)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && password.length === 4) {
      handleSubmit(e as any)
    }
  }

  if (!showContent) {
    return (
      <>
        <style>{keyframes}</style>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
              style={animations.pulse}
            ></div>
            <div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
              style={{ ...animations.pulse, animationDelay: "1s" }}
            ></div>
          </div>

          <div
            className={`relative z-10 transition-all duration-1000 ${isUnlocked ? "scale-110 opacity-0" : "scale-100 opacity-100"}`}
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
              <div className="text-center mb-8">
                {/* Logo */}
               

                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-500 ${
                    isUnlocked
                      ? "bg-green-500/20 text-green-400"
                      : isWrongPassword
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                  }`}
                  style={isWrongPassword ? animations.shake : {}}
                >
                  {isUnlocked ? <UnlockIcon className="w-8 h-8" /> : <LockIcon className="w-8 h-8" />}
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">JS Labs</h1>
                <p className="text-gray-400">Enter 4-digit access code</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password dots */}
                <div className="flex justify-center gap-4 mb-6">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        index < password.length
                          ? isWrongPassword
                            ? "bg-red-500 border-red-500"
                            : isUnlocked
                              ? "bg-green-500 border-green-500"
                              : "bg-blue-500 border-blue-500"
                          : "border-gray-600"
                      }`}
                      style={isWrongPassword && index < password.length ? animations.pulse : {}}
                    />
                  ))}
                </div>

                {/* Hidden password input */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyPress={handleKeyPress}
                    maxLength={4}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="••••"
                    autoComplete="off"
                    disabled={isUnlocked}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={password.length !== 4 || isUnlocked}
                  className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    password.length === 4 && !isUnlocked
                      ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95"
                      : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isUnlocked ? "Unlocking..." : "Enter"}
                </button>

                {/* Instructions */}
                <div className="text-center text-sm text-gray-500">
                  <p>Type your 4-digit code or press Enter</p>
                </div>
              </form>

              {isWrongPassword && (
                <p className="text-red-400 text-center mt-4" style={animations.pulse}>
                  Incorrect code. Try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{keyframes}</style>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
            style={animations.pulse}
          ></div>
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
            style={{ ...animations.pulse, animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"
            style={{ ...animations.pulse, animationDelay: "2s" }}
          ></div>
        </div>

        <div
          className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-12 p-8"
          style={animations.fadeIn}
        >
          {/* Header */}
          <div className="text-center" style={animations.slideDown}>
            {/* Logo */}
           

            <h1
              className="text-6xl font-bold mb-4"
              style={{
                background: "linear-gradient(to right, #60a5fa, #a78bfa, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              JS Labs Tools
            </h1>
           
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full" style={animations.slideUp}>
            <div
              onClick={() => navigate("/pdf-maker")}
              className="group relative bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PdfIcon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">PDF Maker</h3>
                <p className="text-gray-400 mb-4">Create, edit, and manipulate PDF documents with ease</p>
                <div className="flex items-center text-blue-400 group-hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-2">Get Started</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate("/finance")}
              className="group relative bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FinanceIcon className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Finance</h3>
                <p className="text-gray-400 mb-4">Track expenses, manage budgets, and analyze financial data</p>
                <div className="flex items-center text-green-400 group-hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-2">Get Started</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div
  onClick={() => navigate("/billing")}
  className="group relative bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
>
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  <div className="relative z-10">
    <h3 className="text-2xl font-bold text-white mb-3">Billing</h3>
    <p className="text-gray-400 mb-4">
      Generate invoices, apply discounts, and manage lab test billing
    </p>
    <div className="flex items-center text-blue-400 group-hover:translate-x-2 transition-transform duration-300">
      <span className="mr-2">Get Started</span>
      <ArrowRightIcon className="w-4 h-4" />
    </div>
  </div>
</div>

          </div>

          {/* Footer */}
          <div className="text-center text-gray-500" style={animations.fadeInDelayed}>
            <p>Built with ❤️ by Harshith J</p>
          </div>
        </div>
      </div>
    </>
  )
}
