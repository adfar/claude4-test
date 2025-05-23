# 📈 Stock Tracker - Real-time Market Data Dashboard

A modern, responsive web application that provides real-time stock market data with interactive charts and live updates. Built with React, Vite, and Tailwind CSS, featuring a beautiful glassmorphism design.

![Stock Tracker Demo](https://via.placeholder.com/800x400/1e40af/ffffff?text=Stock+Tracker+Dashboard)

## ✨ Features

### 🔄 Real-time Data
- **Live stock prices** for major tech stocks (AAPL, GOOGL, MSFT, AMZN, TSLA, META, NVDA, AMD)
- **Auto-refresh** every 30 seconds during market hours
- **Market status indicator** with live pulse animation
- **Last updated timestamp** for data transparency

### 📊 Interactive Charts
- **Intraday charts** with 5-minute intervals using Recharts
- **Dual chart modes**: Line and Area charts
- **Interactive tooltips** with detailed price information
- **Responsive design** that works on all screen sizes

### 🎨 Modern UI/UX
- **Dark theme** with gradient backgrounds (slate-900 to blue-900)
- **Glassmorphism effects** with backdrop blur and transparency
- **Hover animations** and smooth transitions
- **Color-coded indicators** (green for gains, red for losses)
- **Mobile-first responsive design**

### 📱 Stock Cards
- **Current price** with currency formatting
- **Price change** (absolute and percentage)
- **Daily high/low** and trading volume
- **Click-to-select** for detailed chart view
- **Error handling** with retry functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with ES6+ support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend framework | 18+ |
| **Vite** | Build tool and dev server | Latest |
| **Tailwind CSS** | Utility-first styling | Latest |
| **Recharts** | Chart library | Latest |
| **Lucide React** | Modern icon library | Latest |
| **Yahoo Finance API** | Real-time stock data | Public API |

## 📁 Project Structure

```
stock-tracker/
├── public/
│   ├── index.html          # Main HTML template
│   └── vite.svg           # Favicon
├── src/
│   ├── components/
│   │   ├── Header.jsx      # App header with refresh button
│   │   ├── StockCard.jsx   # Individual stock display
│   │   └── StockChart.jsx  # Interactive chart component
│   ├── services/
│   │   └── stockApi.js     # Yahoo Finance API integration
│   ├── utils/
│   │   └── formatters.js   # Currency and number formatting
│   ├── App.jsx            # Main application component
│   ├── App.css            # Custom styles and animations
│   ├── index.css          # Global styles with Tailwind
│   └── main.jsx           # Application entry point
├── .github/
│   └── copilot-instructions.md  # Copilot customization
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.js         # Vite configuration
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory for custom configuration:

```env
VITE_API_BASE_URL=https://query1.finance.yahoo.com/v8/finance/chart
VITE_REFRESH_INTERVAL=30000
VITE_DEFAULT_SYMBOLS=AAPL,GOOGL,MSFT,AMZN,TSLA,META,NVDA,AMD
```

### Customizing Stock Symbols
Edit `src/services/stockApi.js` to modify the default stock symbols:

```javascript
export const DEFAULT_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD'];
```

## 🌐 API Integration

The application uses Yahoo Finance's public API endpoints:

- **Quote Data**: `https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=2d`
- **Chart Data**: `https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=5m&range=1d`

### CORS Considerations
If you encounter CORS issues in production, consider:
1. Using a CORS proxy service
2. Implementing a backend API wrapper
3. Using alternative financial data APIs

## 🎯 Features in Detail

### Real-time Updates
- Automatic data refresh every 30 seconds
- Manual refresh button with loading states
- Error handling with user-friendly messages
- Market status detection (open/closed)

### Interactive Charts
- Hover tooltips with detailed information
- Switchable chart types (line/area)
- Responsive design for all screen sizes
- Color-coded trends (green/red)

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Accessible design patterns

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Advanced
npm run dev -- --host    # Expose dev server to network
npm run build -- --watch # Build in watch mode
```

### Code Quality
- ESLint configuration for React best practices
- Prettier for consistent code formatting
- Tailwind CSS for maintainable styling
- Component-based architecture

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Use a CORS proxy or implement a backend API
   - Check browser console for specific error messages

2. **API Rate Limiting**
   - Reduce refresh interval in production
   - Implement request caching

3. **Chart Not Displaying**
   - Check network connectivity
   - Verify stock symbol is valid
   - Check browser console for errors

### Performance Optimization
- Components use React.memo where appropriate
- Proper cleanup of intervals and event listeners
- Optimized re-rendering with dependency arrays
- Lazy loading for heavy components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Yahoo Finance](https://finance.yahoo.com/) for providing free financial data
- [Recharts](https://recharts.org/) for excellent React chart components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS framework
- [Lucide](https://lucide.dev/) for beautiful icon library
- [Vite](https://vitejs.dev/) for lightning-fast development experience

---

**Built with ❤️ by [Your Name](https://github.com/yourusername)**

*For support, please open an issue on GitHub or contact [your-email@example.com](mailto:your-email@example.com)*
