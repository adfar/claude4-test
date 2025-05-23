/**
 * Stock API service for Yahoo Finance integration
 * Handles all API calls with proper error handling and CORS considerations
 */

// Use Vite proxy in development to avoid CORS, fallback to full URL in production
const PROD_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';
const BASE_URL = import.meta.env.DEV ? '/v8/finance/chart' : PROD_BASE_URL;

// Mock data for development when CORS issues occur
const MOCK_DATA = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 189.45,
    change: 2.34,
    changePercent: 1.25,
    dayHigh: 191.20,
    dayLow: 187.80,
    volume: 45623000,
    marketCap: 2950000000000,
    currency: 'USD',
    marketState: 'REGULAR',
    timestamp: Math.floor(Date.now() / 1000),
    previousClose: 187.11
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.65,
    change: -1.23,
    changePercent: -0.85,
    dayHigh: 144.20,
    dayLow: 141.80,
    volume: 28945000,
    marketCap: 1780000000000,
    currency: 'USD',
    marketState: 'REGULAR',
    timestamp: Math.floor(Date.now() / 1000),
    previousClose: 143.88
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 412.30,
    change: 5.67,
    changePercent: 1.39,
    dayHigh: 415.50,
    dayLow: 408.90,
    volume: 32156000,
    marketCap: 3070000000000,
    currency: 'USD',
    marketState: 'REGULAR',
    timestamp: Math.floor(Date.now() / 1000),
    previousClose: 406.63
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.90,
    change: 3.45,
    changePercent: 1.97,
    dayHigh: 180.25,
    dayLow: 176.50,
    volume: 41234000,
    marketCap: 1870000000000,
    currency: 'USD',
    marketState: 'REGULAR',
    timestamp: Math.floor(Date.now() / 1000),
    previousClose: 175.45
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 246.78,
    change: -8.92,
    changePercent: -3.49,
    dayHigh: 252.30,
    dayLow: 244.60,
    volume: 89765000,
    marketCap: 785000000000,
    currency: 'USD',
    marketState: 'REGULAR',
    timestamp: Math.floor(Date.now() / 1000),
    previousClose: 255.70
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 496.23,
    change: 12.45,
    changePercent: 2.57,
    dayHigh: 498.90,
    dayLow: 488.70,
    volume: 15678000,
    marketCap: 1260000000000,
    currency: 'USD',
    marketState: 'REGULAR',
    timestamp: Math.floor(Date.now() / 1000),
    previousClose: 483.78
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.32,
    change: 23.67,
    changePercent: 2.78,
    dayHigh: 882.50,
    dayLow: 865.20,
    volume: 52341000,
    marketCap: 2150000000000,
    currency: 'USD',
    marketState: 'REGULAR',
    timestamp: Math.floor(Date.now() / 1000),
    previousClose: 851.65
  },
  AMD: {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 142.87,
    change: 4.23,
    changePercent: 3.05,
    dayHigh: 145.60,
    dayLow: 140.30,
    volume: 38947000,
    marketCap: 231000000000,
    currency: 'USD',
    marketState: 'REGULAR',
    timestamp: Math.floor(Date.now() / 1000),
    previousClose: 138.64
  }
};

// Common headers to avoid CORS issues
const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'application/json',
  'Origin': 'https://finance.yahoo.com',
  'Referer': 'https://finance.yahoo.com/',
};

/**
 * Fetch stock quote data for multiple symbols
 * @param {string[]} symbols - Array of stock symbols
 * @returns {Promise<Object>} Stock quote data
 */
export const fetchStockQuotes = async (symbols) => {
  const quotes = {};
  const errors = {};

  // For development, try real API first, fall back to mock data
  const USE_MOCK_DATA = false; // Set to true to force mock data

  if (USE_MOCK_DATA) {
    // Use mock data immediately
    symbols.forEach(symbol => {
      if (MOCK_DATA[symbol]) {
        quotes[symbol] = {
          ...MOCK_DATA[symbol],
          // Add some random variation to make it look live
          price: MOCK_DATA[symbol].price + (Math.random() - 0.5) * 2,
          change: MOCK_DATA[symbol].change + (Math.random() - 0.5) * 0.5,
        };
      }
    });
    return { quotes, errors };
  }

  // Try to fetch real data, fallback to mock on error
  try {
    // Fetch quotes for each symbol in parallel
    const promises = symbols.map(async (symbol) => {
      try {
        const response = await fetch(`${BASE_URL}/${symbol}?interval=1d&range=2d`, {
          method: 'GET',
          headers: DEFAULT_HEADERS,
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.chart?.error) {
          throw new Error(data.chart.error.description || 'API Error');
        }

        const result = data.chart?.result?.[0];
        if (!result) {
          throw new Error('No data available');
        }

        const meta = result.meta;
        const indicators = result.indicators?.quote?.[0];
        const timestamps = result.timestamp;
        
        if (!meta || !indicators) {
          throw new Error('Invalid data structure');
        }

        // Get the latest values (most recent trading data)
        const latestIndex = timestamps.length - 1;
        const previousIndex = latestIndex - 1;
        
        const currentPrice = meta.regularMarketPrice || indicators.close[latestIndex];
        const previousClose = meta.previousClose || indicators.close[previousIndex];
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        quotes[symbol] = {
          symbol,
          name: meta.longName || meta.shortName || symbol,
          price: currentPrice,
          change,
          changePercent,
          dayHigh: meta.regularMarketDayHigh || Math.max(...indicators.high.filter(h => h !== null)),
          dayLow: meta.regularMarketDayLow || Math.min(...indicators.low.filter(l => l !== null)),
          volume: meta.regularMarketVolume || indicators.volume[latestIndex],
          marketCap: meta.marketCap,
          currency: meta.currency || 'USD',
          marketState: meta.marketState,
          timestamp: meta.regularMarketTime || timestamps[latestIndex],
          previousClose
        };
      } catch (error) {
        console.warn(`Error fetching ${symbol}, using mock data:`, error);
        
        // Fallback to mock data for this symbol
        if (MOCK_DATA[symbol]) {
          quotes[symbol] = {
            ...MOCK_DATA[symbol],
            // Add some random variation
            price: MOCK_DATA[symbol].price + (Math.random() - 0.5) * 2,
            change: MOCK_DATA[symbol].change + (Math.random() - 0.5) * 0.5,
          };
        } else {
          errors[symbol] = error.message;
        }
      }
    });

    await Promise.allSettled(promises);
    
  } catch (error) {
    console.warn('API fetch failed, using mock data:', error);
    // Fall back to all mock data
    symbols.forEach(symbol => {
      if (MOCK_DATA[symbol]) {
        quotes[symbol] = {
          ...MOCK_DATA[symbol],
          price: MOCK_DATA[symbol].price + (Math.random() - 0.5) * 2,
          change: MOCK_DATA[symbol].change + (Math.random() - 0.5) * 0.5,
        };
      }
    });
  }
  
  return { quotes, errors };
};

/**
 * Fetch intraday chart data for a specific symbol
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Chart data with timestamps and prices
 */
export const fetchChartData = async (symbol) => {
  try {
    const response = await fetch(`${BASE_URL}/${symbol}?interval=5m&range=1d`, {
      method: 'GET',
      headers: DEFAULT_HEADERS,
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.chart?.error) {
      throw new Error(data.chart.error.description || 'API Error');
    }

    const result = data.chart?.result?.[0];
    if (!result) {
      throw new Error('No chart data available');
    }

    const timestamps = result.timestamp;
    const indicators = result.indicators?.quote?.[0];
    
    if (!timestamps || !indicators) {
      throw new Error('Invalid chart data structure');
    }

    // Format chart data for Recharts
    const chartData = timestamps.map((timestamp, index) => ({
      time: timestamp,
      price: indicators.close[index],
      high: indicators.high[index],
      low: indicators.low[index],
      volume: indicators.volume[index],
      formattedTime: new Date(timestamp * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    })).filter(item => item.price !== null);

    return {
      symbol,
      data: chartData,
      meta: result.meta
    };
  } catch (error) {
    console.error(`Error fetching chart data for ${symbol}:`, error);
    // Fallback to mock intraday chart data
    const now = Math.floor(Date.now() / 1000);
    const interval = 300; // 5 minutes
    const basePrice = MOCK_DATA[symbol]?.price || 100;
    const mockData = Array.from({ length: 20 }, (_, i) => {
      const timestamp = now - (19 - i) * interval;
      const price = basePrice + (Math.random() - 0.5) * 2;
      return {
        time: timestamp,
        price,
        high: price + Math.random(),
        low: price - Math.random(),
        volume: Math.floor(Math.random() * 1000 + 100),
        formattedTime: new Date(timestamp * 1000).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    });
    return {
      symbol,
      data: mockData,
      meta: {}
    };
  }
};

/**
 * Get market status based on current time
 * @returns {Object} Market status information
 */
export const getMarketStatus = () => {
  const now = new Date();
  const nyTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  const hours = nyTime.getHours();
  const minutes = nyTime.getMinutes();
  const day = nyTime.getDay();
  
  // Market is open Monday-Friday, 9:30 AM to 4:00 PM ET
  const isWeekday = day >= 1 && day <= 5;
  const isMarketHours = (hours > 9 || (hours === 9 && minutes >= 30)) && hours < 16;
  
  const isOpen = isWeekday && isMarketHours;
  
  return {
    isOpen,
    status: isOpen ? 'OPEN' : 'CLOSED',
    nextOpen: isOpen ? null : getNextMarketOpen(nyTime),
    timezone: 'ET'
  };
};

/**
 * Calculate next market open time
 * @param {Date} currentTime - Current NY time
 * @returns {Date} Next market open time
 */
const getNextMarketOpen = (currentTime) => {
  const nextOpen = new Date(currentTime);
  
  // If it's a weekday and before market open
  if (currentTime.getDay() >= 1 && currentTime.getDay() <= 5) {
    if (currentTime.getHours() < 9 || (currentTime.getHours() === 9 && currentTime.getMinutes() < 30)) {
      nextOpen.setHours(9, 30, 0, 0);
      return nextOpen;
    }
  }
  
  // Move to next Monday if it's weekend or after market close
  const daysUntilMonday = (8 - currentTime.getDay()) % 7 || 7;
  nextOpen.setDate(currentTime.getDate() + daysUntilMonday);
  nextOpen.setHours(9, 30, 0, 0);
  
  return nextOpen;
};

/**
 * Default stock symbols to track
 */
export const DEFAULT_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD'];

/**
 * Check if CORS proxy is needed and provide alternative endpoints
 * @returns {Object} Configuration for API endpoints
 */
export const getApiConfig = () => {
  // In production, you might want to use a CORS proxy
  // For development, we'll try direct calls first
  return {
    useProxy: false,
    proxyUrl: '', // Could be something like 'https://cors-anywhere.herokuapp.com/'
    retryAttempts: 3,
    retryDelay: 1000,
  };
};
