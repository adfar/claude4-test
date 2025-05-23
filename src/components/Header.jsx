import { RefreshCw, Activity, Clock } from 'lucide-react';
import { formatLastUpdated } from '../utils/formatters';
import { getMarketStatus } from '../services/stockApi';

const Header = ({ onRefresh, isLoading, lastUpdated }) => {
  const marketStatus = getMarketStatus();

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">
                Stock Tracker
              </h1>
              <p className="text-sm text-white hidden sm:block">
                Real-time market data
              </p>
            </div>
          </div>

          {/* Market Status and Controls */}
          <div className="flex items-center space-x-4">
            {/* Market Status Indicator */}
            <div className="hidden md:flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                marketStatus.isOpen 
                  ? 'bg-green-500/20 text-green-200' 
                  : 'bg-red-500/20 text-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  marketStatus.isOpen 
                    ? 'bg-green-400 animate-pulse-fast' 
                    : 'bg-red-400'
                }`} />
                <span>Market {marketStatus.status}</span>
              </div>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="hidden lg:flex items-center space-x-1 text-sm text-white">
                <Clock className="w-4 h-4" />
                <span>Updated: {formatLastUpdated(lastUpdated)}</span>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95'
              }`}
            >
              <RefreshCw 
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
              />
              <span className="hidden sm:inline">
                {isLoading ? 'Updating...' : 'Refresh'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Market Status */}
        <div className="md:hidden pb-3 text-white">
          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
            marketStatus.isOpen 
              ? 'bg-green-500/20 text-green-200' 
              : 'bg-red-500/20 text-red-200'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              marketStatus.isOpen 
                ? 'bg-green-400 animate-pulse-fast' 
                : 'bg-red-400'
            }`} />
            <span>Market {marketStatus.status}</span>
          </div>
          
          {lastUpdated && (
            <div className="flex items-center space-x-1 text-sm text-white mt-1">
              <Clock className="w-4 h-4" />
              <span>Updated: {formatLastUpdated(lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
