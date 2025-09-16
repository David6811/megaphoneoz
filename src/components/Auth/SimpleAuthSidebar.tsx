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
    <div className={`sidebar-section ${className}`} style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#c60800', margin: 0, padding: '15px', fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #f0f0f0' }}>Member Login</h3>
      {message && (
        <div style={{ 
          padding: '10px 15px', 
          fontSize: '12px', 
          color: message.includes('Success') ? '#28a745' : '#dc3545',
          textAlign: 'center',
          backgroundColor: message.includes('Success') ? '#d4edda' : '#f8d7da',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {message}
        </div>
      )}
      
      {!showLogin ? (
        <div style={{ padding: '20px 15px', textAlign: 'center' }}>
          <button 
            onClick={() => setShowLogin(true)}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c60800';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
            }}
          >
            Sign In / Sign Up
          </button>
        </div>
      ) : (
        <div style={{ padding: '20px 15px' }}>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c60800'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            {isSignUp && (
              <input
                type="text"
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                  background: '#fafafa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#c60800';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.background = '#fafafa';
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
                padding: '10px 12px',
                marginBottom: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c60800'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                  background: '#fafafa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#c60800';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.background = '#fafafa';
                }}
              />
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '10px',
                backgroundColor: loading ? '#999' : '#c60800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#a50600';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#c60800';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
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
                padding: '10px 16px',
                marginBottom: '8px',
                backgroundColor: 'transparent',
                color: '#c60800',
                border: '1px solid #c60800',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#c60800';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#c60800';
                }
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
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
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