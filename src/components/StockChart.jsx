import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { fetchChartData } from '../services/stockApi';
import { formatCurrency, formatTime } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
        <p className="text-white font-medium">{data.formattedTime}</p>
        <p className="text-blue-400">
          Price: <span className="font-bold">{formatCurrency(data.price)}</span>
        </p>
        <p className="text-gray-300 text-sm">
          High: {formatCurrency(data.high)} | Low: {formatCurrency(data.low)}
        </p>
        {data.volume && (
          <p className="text-gray-300 text-sm">
            Volume: {data.volume.toLocaleString()}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const StockChart = ({ symbol, stock }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line'); // 'line' or 'area'

  useEffect(() => {
    if (!symbol) return;

    const loadChartData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchChartData(symbol);
        setChartData(data);
      } catch (err) {
        setError(err.message);
        console.error('Chart data error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [symbol]);

  if (!symbol) {
    return (
      <div className="bg-black/95 backdrop-blur-sm border border-white/50 rounded-xl p-8">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Select a Stock
          </h3>
          <p className="text-white">
            Click on any stock card to view its intraday chart
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-black/95 backdrop-blur-sm border border-white/50 rounded-xl p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-bold text-white mb-2">
            Loading Chart
          </h3>
          <p className="text-white">
            Fetching intraday data for {symbol}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600/50 backdrop-blur-sm border border-red-500/50 rounded-xl p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Chart Error
          </h3>
          <p className="text-red-100 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return (
      <div className="bg-black/95 backdrop-blur-sm border border-white/50 rounded-xl p-8">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No Chart Data
          </h3>
          <p className="text-white">
            Chart data is not available for {symbol} at this time
          </p>
        </div>
      </div>
    );
  }

  // Calculate price change for gradient color
  const firstPrice = chartData.data[0]?.price;
  const lastPrice = chartData.data[chartData.data.length - 1]?.price;
  const isPositive = lastPrice >= firstPrice;

  const gradientId = `gradient-${symbol}`;
  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const fillColor = isPositive ? '#10b98150' : '#ef444450';

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">
            {symbol} Intraday Chart
          </h3>
          <p className="text-gray-300">
            5-minute intervals • Last {chartData.data.length} data points
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Chart Type Toggle */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === 'area'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Area
            </button>
          </div>

          {/* Price Trend Indicator */}
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-medium ${
            isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {isPositive ? '+' : ''}{((lastPrice - firstPrice) / firstPrice * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData.data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="formattedTime"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: strokeColor,
                  stroke: '#fff',
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="formattedTime"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: strokeColor,
                  stroke: '#fff',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <p className="text-gray-400 mb-1">Period High</p>
          <p className="text-white font-bold">
            {formatCurrency(Math.max(...chartData.data.map(d => d.price)))}
          </p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <p className="text-gray-400 mb-1">Period Low</p>
          <p className="text-white font-bold">
            {formatCurrency(Math.min(...chartData.data.map(d => d.price)))}
          </p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <p className="text-gray-400 mb-1">Opening</p>
          <p className="text-white font-bold">
            {formatCurrency(firstPrice)}
          </p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <p className="text-gray-400 mb-1">Current</p>
          <p className="text-white font-bold">
            {formatCurrency(lastPrice)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
