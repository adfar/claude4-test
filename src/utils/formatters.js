/**
 * Format a number as currency (USD)
 * @param {number} value - The value to format
 * @param {number} minimumFractionDigits - Minimum decimal places
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, minimumFractionDigits = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
};

/**
 * Format a number as percentage
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

/**
 * Format large numbers with K, M, B suffixes
 * @param {number} value - The value to format
 * @returns {string} Formatted number string
 */
export const formatVolume = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  
  return value.toString();
};

/**
 * Format price change with appropriate sign and color
 * @param {number} change - The price change value
 * @param {number} changePercent - The percentage change
 * @returns {object} Object with formatted strings and color class
 */
export const formatPriceChange = (change, changePercent) => {
  const isPositive = change >= 0;
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
  const arrow = isPositive ? '↑' : '↓';
  
  return {
    change: `${isPositive ? '+' : ''}${formatCurrency(Math.abs(change))}`,
    percentage: formatPercentage(changePercent),
    colorClass,
    arrow,
    isPositive
  };
};

/**
 * Format timestamp to readable string
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time string
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Format last updated timestamp
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatLastUpdated = (date) => {
  if (!date) return '';
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
