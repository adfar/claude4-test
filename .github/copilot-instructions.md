<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Stock Tracker Application - Copilot Instructions

## Project Overview
This is a real-time stock tracker web application built with React, Vite, and Tailwind CSS. The application fetches live stock data from Yahoo Finance API and displays it in an interactive dashboard with charts.

## Key Technologies
- **React 18+** with functional components and hooks
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Recharts** for data visualization
- **Lucide React** for modern icons
- **Yahoo Finance API** for real-time stock data

## Architecture Guidelines
- Use functional components with React hooks
- Implement proper error handling for API calls
- Follow responsive design principles (mobile-first)
- Use glassmorphism design patterns with backdrop blur
- Implement proper loading states and error boundaries

## Code Style Preferences
- Use arrow functions for component definitions
- Prefer template literals for string interpolation
- Use destructuring for props and state
- Follow Tailwind CSS utility classes over custom CSS
- Use semantic HTML elements where appropriate

## API Integration
- All stock data comes from Yahoo Finance endpoints
- Handle CORS issues gracefully with fallback options
- Implement retry logic for failed requests
- Use proper error messages for different failure scenarios

## State Management
- Use React useState and useEffect hooks
- Implement proper dependency arrays for useEffect
- Use useCallback for expensive computations
- Clean up intervals and subscriptions properly

## Styling Guidelines
- Use Tailwind CSS utility classes
- Follow dark theme design patterns
- Implement hover and focus states for interactive elements
- Use consistent spacing and color schemes
- Ensure responsive design across all screen sizes

## Performance Considerations
- Optimize re-renders with proper dependency arrays
- Use React.memo for heavy components if needed
- Implement proper cleanup for intervals and event listeners
- Minimize API calls with intelligent caching

## Error Handling
- Provide user-friendly error messages
- Implement loading states for all async operations
- Handle network failures gracefully
- Show appropriate fallback content when data is unavailable
