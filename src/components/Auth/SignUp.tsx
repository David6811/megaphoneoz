import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material'
import { AuthService, SignUpData } from '../../services/authService'

interface SignUpProps {
  onSuccess?: () => void
  onSwitchToSignIn?: () => void
}

export const SignUp: React.FC<SignUpProps> = ({ onSuccess, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: ''
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (field: keyof SignUpData) => (
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

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await AuthService.signUp(formData)
      
      if (result.success) {
        setSuccess(result.message)
        setFormData({ email: '', password: '' })
        setConfirmPassword('')
        onSuccess?.()
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign Up
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => {
              handleChange('password')(e)
              setError('')
            }}
            margin="normal"
            required
            disabled={loading}
            helperText="Password must be at least 6 characters long"
          />
          
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setError('')
            }}
            margin="normal"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>

          {onSwitchToSignIn && (
            <Button
              fullWidth
              variant="text"
              onClick={onSwitchToSignIn}
              disabled={loading}
            >
              Already have an account? Sign In
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  )
}