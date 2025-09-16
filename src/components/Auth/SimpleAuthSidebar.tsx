import React, { useState, useEffect } from 'react'
import { AuthService } from '../../services/authService'
import { User } from '@supabase/supabase-js'

interface SimpleAuthSidebarProps {
  className?: string
}

export const SimpleAuthSidebar: React.FC<SimpleAuthSidebarProps> = ({ className = '' }) => {
  const [showLogin, setShowLogin] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    AuthService.getCurrentUser().then(setUser)
    
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user)
      if (user) {
        setShowLogin(false)
        setMessage('Successfully signed in!')
        setTimeout(() => setMessage(''), 3000)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setMessage('Please fill in all fields')
      return
    }

    if (isSignUp && password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const result = isSignUp 
        ? await AuthService.signUp({ email, password, displayName })
        : await AuthService.signIn({ email, password })
      
      if (result.success) {
        setMessage(result.message)
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setDisplayName('')
      } else {
        setMessage(result.message)
      }
    } catch (err) {
      setMessage('An error occurred, please try again')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await AuthService.signOut()
      setMessage('Successfully signed out')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className={`sidebar-section ${className}`}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
            {user.email}
          </p>
          <button
            onClick={handleSignOut}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`sidebar-section ${className}`}>
      <h3 className="sidebar-title">Member Login</h3>
      {message && (
        <div style={{ 
          padding: '5px 0', 
          fontSize: '12px', 
          color: message.includes('Success') ? 'green' : 'red',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
      
      {!showLogin ? (
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => setShowLogin(true)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              backgroundColor: '#c60800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign In / Sign Up
          </button>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            {isSignUp && (
              <input
                type="text"
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            )}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '5px',
                backgroundColor: '#c60800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '6px',
                marginBottom: '5px',
                backgroundColor: 'transparent',
                color: '#c60800',
                border: '1px solid #c60800',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              {isSignUp ? 'Have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '6px',
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  )
}