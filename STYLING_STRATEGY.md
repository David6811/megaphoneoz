# Material-First, Tailwind-Second Styling Strategy

## Philosophy
Use Material Design components and theming as the primary styling system, with Tailwind CSS as a utility complement for rapid prototyping and fine-tuning.

## Priority Order

### 1. Material-UI Components (FIRST CHOICE)
```tsx
// ✅ PREFERRED: Use Material components with sx prop
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
<Typography variant="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
<Button variant="contained" color="primary">
<Card elevation={2}>
```

### 2. Material Theme System (SECOND CHOICE)
```tsx
// ✅ GOOD: Use theme values consistently
const theme = useTheme();
<div style={{ color: theme.palette.primary.main, padding: theme.spacing(2) }}>

// ✅ GOOD: Custom Material theme extensions
const theme = createTheme({
  palette: {
    brand: { main: '#c60800' }
  },
  spacing: (factor) => `${8 * factor}px`
});
```

### 3. Tailwind Utilities (LAST RESORT)
```tsx
// ⚠️ ONLY WHEN: Material doesn't provide the utility
<div className="backdrop-blur-sm"> {/* Material doesn't have backdrop-blur */}
<div className="animate-pulse">    {/* Quick animations */}
<div className="aspect-video">     {/* Aspect ratios */}
```

## Implementation Rules

### Rule 1: Component Structure
```tsx
// Use Material for layout and typography
<Container maxWidth="lg">
  <Typography variant="h2" component="h1">
    <Box sx={{ display: 'grid', gap: 3 }}>
      // Add Tailwind only for missing utilities
      <div className="backdrop-blur-sm">
```

### Rule 2: Responsive Design
```tsx
// ✅ PREFERRED: Material breakpoints
<Box sx={{ 
  display: { xs: 'block', md: 'flex' },
  padding: { xs: 2, md: 4 }
}}>

// ⚠️ AVOID: Tailwind responsive classes when Material can handle it
<div className="block md:flex p-4 md:p-8"> // Don't do this
```

### Rule 3: Colors & Typography
```tsx
// ✅ ALWAYS: Use Material theme colors
<Typography color="primary.main">
<Box sx={{ backgroundColor: 'background.paper' }}>

// ❌ NEVER: Use Tailwind colors when Material theme exists
<div className="text-red-600 bg-gray-100"> // Don't do this
```

### Rule 4: Spacing & Sizing
```tsx
// ✅ PREFERRED: Material spacing system
<Box sx={{ padding: 2, margin: 1 }}> // Uses theme.spacing()

// ⚠️ ACCEPTABLE: Tailwind for one-offs
<div className="h-screen w-full"> // Viewport units that Material doesn't provide
```

## Practical Examples

### Navigation Component
```tsx
// Material-first approach
<AppBar position="sticky">
  <Toolbar>
    <Typography variant="h6">Brand</Typography>
    <Box sx={{ display: 'flex', gap: 2 }}>
      {/* Use Tailwind only for animations/effects */}
      <Button className="hover:animate-pulse">
```

### Article Card
```tsx
// Material-first approach
<Card elevation={2}>
  <CardMedia component="img" image={src} />
  <CardContent>
    <Typography variant="h5" gutterBottom>
    <Typography variant="body2" color="text.secondary">
    {/* Tailwind for aspect ratio utility */}
    <div className="aspect-video">
```

### Form Layouts
```tsx
// Material-first approach
<Stack spacing={3}>
  <TextField variant="outlined" fullWidth />
  <Button variant="contained" size="large">
  {/* Tailwind for custom layouts Material doesn't provide */}
  <div className="grid grid-cols-2 gap-4">
```

## Configuration Priority

### CSS Load Order
```css
/* 1. Material-UI baseline */
@import '@mui/material/styles';

/* 2. Tailwind utilities (after Material) */
@tailwind utilities;
```

### Theme Integration
```tsx
const theme = createTheme({
  // Material theme defines the design system
  palette: { primary: { main: '#c60800' } },
  typography: { fontFamily: 'Roboto' },
  
  // Extend with Tailwind-compatible values
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Allow Tailwind utilities to work with Material
      }
    }
  }
});
```

## Migration Strategy

1. **Start with Material components** for major layout/UI elements
2. **Apply Material theming** for colors, typography, spacing
3. **Add Tailwind utilities** only for gaps Material doesn't fill
4. **Avoid Tailwind** for anything Material provides natively

## Benefits

- **Consistent Design System**: Material provides comprehensive design language
- **Type Safety**: Material theme values are typed and consistent
- **Performance**: Reduce Tailwind bundle size by using only needed utilities
- **Maintainability**: Clear hierarchy makes decisions easier
- **Accessibility**: Material components include ARIA attributes by default