import { TrendingUp, TrendingDown, BarChart3, Volume2 } from 'lucide-react';
import { formatCurrency, formatPriceChange, formatVolume } from '../utils/formatters';

const StockCard = ({ stock, isSelected, onClick, hasError, errorMessage }) => {
  if (hasError) {
    return (
      <div className="bg-red-600/50 backdrop-blur-sm border border-red-500/50 rounded-xl p-6 hover:bg-red-600/60 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
          <div className="text-red-200 text-sm">Error</div>
        </div>
        <p className="text-red-100 text-sm">{errorMessage}</p>
        <button
          onClick={onClick}
          className="mt-3 text-blue-300 hover:text-blue-200 text-sm underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="bg-gray-800/60 backdrop-blur-sm border border-white/30 rounded-xl p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-600 rounded w-16"></div>
          <div className="h-4 bg-gray-600 rounded w-12"></div>
        </div>
        <div className="h-8 bg-gray-600 rounded w-24 mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-20 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const priceChange = formatPriceChange(stock.change, stock.changePercent);
  
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        isSelected
          ? 'bg-blue-500/20 border-2 border-blue-400 shadow-lg shadow-blue-500/25'
          : 'bg-black/95 backdrop-blur-sm border border-white/50 hover:bg-black'
      }`}
    >
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
        priceChange.isPositive ? 'from-green-400 to-emerald-600' : 'from-red-400 to-rose-600'
      }`} />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
            {stock.symbol}
          </h3>
          {stock.name && stock.name !== stock.symbol && (
            <p className="text-sm text-white truncate max-w-[150px]">
              {stock.name}
            </p>
          )}
        </div>
        
        <div className={`flex items-center space-x-1 ${priceChange.colorClass}`}>
          {priceChange.isPositive ? (
            <TrendingUp className="w-5 h-5" />
          ) : (
            <TrendingDown className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">
            {priceChange.arrow}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="relative mb-4">
        <div className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors">
          {formatCurrency(stock.price)}
        </div>
        <div className={`text-sm font-medium ${priceChange.colorClass}`}>
          {priceChange.change} ({priceChange.percentage})
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white">High</span>
            <span className="text-white font-medium">
              {formatCurrency(stock.dayHigh)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Low</span>
            <span className="text-white font-medium">
              {formatCurrency(stock.dayLow)}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Volume2 className="w-3 h-3 text-gray-300" />
              <span className="text-white">Volume</span>
            </div>
            <span className="text-white font-medium">
              {formatVolume(stock.volume)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-3 h-3 text-gray-300" />
              <span className="text-white">Prev Close</span>
            </div>
            <span className="text-white font-medium">
              {formatCurrency(stock.previousClose)}
            </span>
          </div>
        </div>
      </div>

      {/* Market State Indicator */}
      {stock.marketState && (
        <div className="relative mt-4 flex justify-between items-center">
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            stock.marketState === 'REGULAR' 
              ? 'bg-green-500/20 text-green-200' 
              : 'bg-yellow-500/20 text-yellow-200'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              stock.marketState === 'REGULAR' ? 'bg-green-400' : 'bg-yellow-400'
            }`} />
            <span>{stock.marketState}</span>
          </div>
          
          <div className="text-xs text-white">
            {stock.currency || 'USD'}
          </div>
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse-fast" />
        </div>
      )}
    </div>
  );
};

export default StockCard;
