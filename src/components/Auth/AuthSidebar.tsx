import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Collapse
} from '@mui/material'
import { AuthService } from '../../services/authService'
import { User } from '@supabase/supabase-js'

interface AuthSidebarProps {
  className?: string
}

export const AuthSidebar: React.FC<AuthSidebarProps> = ({ className = '' }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    AuthService.getCurrentUser().then(setUser)
    
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user)
      if (user) {
        setExpanded(false)
        setFormData({ email: '', password: '', confirmPassword: '' })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.value })
    setError('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long')
        return
      }
    }

    setLoading(true)
    setError('')

    try {
      const result = isSignUp 
        ? await AuthService.signUp({ email: formData.email, password: formData.password })
        : await AuthService.signIn({ email: formData.email, password: formData.password })
      
      if (result.success) {
        setSuccess(result.message)
        setFormData({ email: '', password: '', confirmPassword: '' })
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await AuthService.signOut()
      setSuccess('Signed out successfully')
    } catch (err) {
      setError('Error signing out')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className={`sidebar-section ${className}`}>
        <h3 className="sidebar-title">WELCOME BACK</h3>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            {user.email}
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={handleSignOut}
            disabled={loading}
            sx={{ fontSize: '0.75rem' }}
          >
            {loading ? <CircularProgress size={16} /> : 'Sign Out'}
          </Button>
        </Box>
      </div>
    )
  }

  return (
    <div className={`sidebar-section ${className}`}>
      <h3 className="sidebar-title">MEMBER LOGIN</h3>
      
      {!expanded ? (
        <Box sx={{ textAlign: 'center', p: 1 }}>
          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={() => setExpanded(true)}
            sx={{ mb: 1, fontSize: '0.75rem' }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => {
              setIsSignUp(true)
              setExpanded(true)
            }}
            sx={{ fontSize: '0.75rem' }}
          >
            Sign Up
          </Button>
        </Box>
      ) : (
        <Collapse in={expanded}>
          <Box sx={{ p: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 1, fontSize: '0.75rem' }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 1, fontSize: '0.75rem' }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                margin="dense"
                size="small"
                required
                disabled={loading}
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                margin="dense"
                size="small"
                required
                disabled={loading}
              />
              
              {isSignUp && (
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  margin="dense"
                  size="small"
                  required
                  disabled={loading}
                />
              )}

              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="small"
                  disabled={loading}
                  sx={{ mb: 1, fontSize: '0.75rem' }}
                >
                  {loading ? <CircularProgress size={16} /> : (isSignUp ? 'Sign Up' : 'Sign In')}
                </Button>
                
                <Button
                  fullWidth
                  variant="text"
                  size="small"
                  onClick={() => setIsSignUp(!isSignUp)}
                  disabled={loading}
                  sx={{ fontSize: '0.75rem' }}
                >
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </Button>
                
                <Button
                  fullWidth
                  variant="text"
                  size="small"
                  onClick={() => setExpanded(false)}
                  disabled={loading}
                  sx={{ fontSize: '0.75rem', mt: 1 }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Collapse>
      )}
    </div>
  )
}