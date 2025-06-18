# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application called "megaphoneoz" bootstrapped with Create React App. It uses React 19.1.0 and follows standard Create React App conventions.

## Common Commands

### Development
- `npm start` - Start development server (runs on http://localhost:3000)
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (one-way operation)

### Testing
- `npm test` - Run all tests
- `npm test -- --watchAll=false` - Run tests once without watch mode
- `npm test -- --testNamePattern="pattern"` - Run specific tests by pattern

## Architecture

### Project Structure
- `src/App.js` - Main application component
- `src/index.js` - Application entry point
- `public/` - Static assets and HTML template
- `src/` - React components, styles, and application code

### Testing Setup
- Uses Jest and React Testing Library (@testing-library/react)
- Test files should be named `*.test.js` or placed in `__tests__/` folders
- Setup configured in `src/setupTests.js`

### Styling
- Uses CSS files imported directly into components
- Main styles in `src/App.css` and `src/index.css`

## Development Notes

- The project uses the standard Create React App ESLint configuration
- Web Vitals are configured for performance monitoring
- Browser support targets are defined in package.json browserslist