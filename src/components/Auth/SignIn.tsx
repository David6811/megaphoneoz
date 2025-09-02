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
import { AuthService, SignInData } from '../../services/authService'

interface SignInProps {
  onSuccess?: () => void
  onSwitchToSignUp?: () => void
}

export const SignIn: React.FC<SignInProps> = ({ onSuccess, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof SignInData) => (
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

    setLoading(true)
    setError('')

    try {
      const result = await AuthService.signIn(formData)
      
      if (result.success) {
        setFormData({ email: '', password: '' })
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
          Sign In
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
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
            onChange={handleChange('password')}
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
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          {onSwitchToSignUp && (
            <Button
              fullWidth
              variant="text"
              onClick={onSwitchToSignUp}
              disabled={loading}
            >
              Don't have an account? Sign Up
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  )
}