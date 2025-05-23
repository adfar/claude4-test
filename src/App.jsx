import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StockCard from './components/StockCard';
import StockChart from './components/StockChart';
import { fetchStockQuotes, DEFAULT_SYMBOLS } from './services/stockApi';
import './App.css';

function App() {
  const [stocks, setStocks] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  // Auto-refresh interval (30 seconds)
  const REFRESH_INTERVAL = 30000;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { quotes, errors: fetchErrors } = await fetchStockQuotes(DEFAULT_SYMBOLS);
      setStocks(quotes);
      setErrors(fetchErrors);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setErrors({ general: 'Failed to fetch stock data. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh setup
  useEffect(() => {
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleStockSelect = (symbol) => {
    setSelectedStock(symbol === selectedStock ? null : symbol);
  };

  const handleManualRefresh = () => {
    if (!loading) {
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <Header 
        onRefresh={handleManualRefresh}
        isLoading={loading}
        lastUpdated={lastUpdated}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {errors.general && (
          <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-red-100 font-medium">Connection Error</span>
            </div>
            <p className="text-red-100 mt-1">{errors.general}</p>
          </div>
        )}

        {/* Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {DEFAULT_SYMBOLS.map((symbol) => (
            <StockCard
              key={symbol}
              stock={stocks[symbol]}
              isSelected={selectedStock === symbol}
              onClick={() => handleStockSelect(symbol)}
              hasError={!!errors[symbol]}
              errorMessage={errors[symbol]}
            />
          ))}
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <StockChart 
            symbol={selectedStock} 
            stock={selectedStock ? stocks[selectedStock] : null}
          />
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="text-white font-medium">Updating stock data...</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/10">
          <div className="space-y-2">
            <p className="text-gray-200 text-sm">
              Real-time stock data powered by Yahoo Finance
            </p>
            <p className="text-gray-300 text-xs">
              Data refreshes automatically every 30 seconds during market hours
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <span>Built with React + Vite</span>
              <span>•</span>
              <span>Styled with Tailwind CSS</span>
              <span>•</span>
              <span>Charts by Recharts</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App
