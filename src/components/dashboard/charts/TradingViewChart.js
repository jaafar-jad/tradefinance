"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBitcoin, FaEthereum, FaChartLine, FaChartBar, FaChartArea, FaClock } from 'react-icons/fa';
import { SiDogecoin, SiLitecoin, SiRipple, SiCardano, SiSolana, SiBinance } from 'react-icons/si';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

const cryptoList = [
  { symbol: "BTCUSDT", name: "Bitcoin", icon: FaBitcoin, color: "#F7931A" },
  { symbol: "ETHUSDT", name: "Ethereum", icon: FaEthereum, color: "#627EEA" },
  { symbol: "BNBUSDT", name: "BNB", icon: SiBinance, color: "#F3BA2F" },
  { symbol: "XRPUSDT", name: "Ripple", icon: SiRipple, color: "#23292F" },
  { symbol: "SOLUSDT", name: "Solana", icon: SiSolana, color: "#00FFA3" },
  { symbol: "DOGEUSDT", name: "Dogecoin", icon: SiDogecoin, color: "#C2A633" },
  { symbol: "LTCUSDT", name: "Litecoin", icon: SiLitecoin, color: "#345D9D" },
  { symbol: "ADAUSDT", name: "Cardano", icon: SiCardano, color: "#0033AD" }
];

const timeframes = [
  { value: "1", label: "1m", icon: FaClock },
  { value: "5", label: "5m", icon: FaClock },
  { value: "15", label: "15m", icon: FaClock },
  { value: "60", label: "1h", icon: FaClock },
  { value: "240", label: "4h", icon: FaClock },
  { value: "D", label: "1D", icon: FaClock },
  { value: "W", label: "1W", icon: FaClock },
];

const chartTypes = [
  { value: "1", label: "Candles", icon: FaChartBar },
  { value: "2", label: "Line", icon: FaChartLine },
  { value: "3", label: "Area", icon: FaChartArea },
];

export default function TradingViewChart() {
  const container = useRef();
  const [selectedCrypto, setSelectedCrypto] = useState("BTCUSDT");
  const [selectedTimeframe, setSelectedTimeframe] = useState("15");
  const [selectedChartType, setSelectedChartType] = useState("1");
  const [prices, setPrices] = useState({});
  const [priceChanges, setPriceChanges] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const priceWs = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    
    priceWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const updatedPrices = {};
      const updatedChanges = {};
      
      data.forEach(ticker => {
        if (cryptoList.some(crypto => crypto.symbol === ticker.s)) {
          updatedPrices[ticker.s] = parseFloat(ticker.c).toFixed(2);
          updatedChanges[ticker.s] = {
            percent: parseFloat(ticker.P).toFixed(2),
            isPositive: parseFloat(ticker.P) >= 0
          };
        }
      });
      
      setPrices(prev => ({...prev, ...updatedPrices}));
      setPriceChanges(prev => ({...prev, ...updatedChanges}));
    };

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
    {
      "width": "100%",
      "height": "${isFullscreen ? '100%' : window.innerWidth < 768 ? '500' : '650'}",
      "symbol": "BINANCE:${selectedCrypto}",
      "interval": "${selectedTimeframe}",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "${selectedChartType}",
      "locale": "en",
      "enable_publishing": false,
      "backgroundColor": "rgba(0, 0, 0, 0.9)",
      "gridColor": "rgba(220, 38, 38, 0.1)",
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": true,
      "calendar": true,
      "hide_volume": false,
      "support_host": "https://www.tradingview.com",
      "studies": [
        "RSI@tv-basicstudies",
        "MASimple@tv-basicstudies",
        "MACD@tv-basicstudies",
        "AwesomeOscillator@tv-basicstudies",
        "StochasticRSI@tv-basicstudies"
      ],
      "show_popup_button": true,
      "popup_width": "1000",
      "popup_height": "650",
      "container_id": "tradingview_chart",
      "withdateranges": true,
      "allow_symbol_change": true,
      "details": true,
      "hotlist": true,
      "calendar": true,
      "toolbar_bg": "rgba(0, 0, 0, 1)",
      "watchlist": [
        "BINANCE:BTCUSDT",
        "BINANCE:ETHUSDT",
        "BINANCE:BNBUSDT",
        "BINANCE:XRPUSDT",
        "BINANCE:SOLUSDT",
        "BINANCE:DOGEUSDT",
        "BINANCE:LTCUSDT",
        "BINANCE:ADAUSDT"
      ],
      "drawings_access": { 
        "type": "all" 
      },
      "timeframes": [
        "1m", "5m", "15m", "30m",
        "1h", "2h", "4h",
        "1D", "1W", "1M"
      ],
      "overrides": {
        "mainSeriesProperties.candleStyle.upColor": "#26A69A",
        "mainSeriesProperties.candleStyle.downColor": "#EF5350",
        "mainSeriesProperties.candleStyle.drawWick": true,
        "mainSeriesProperties.candleStyle.drawBorder": true,
        "mainSeriesProperties.candleStyle.borderUpColor": "#26A69A",
        "mainSeriesProperties.candleStyle.borderDownColor": "#EF5350"
      }
    }`;
    
    if (container.current) {
      container.current.innerHTML = '';
      container.current.appendChild(script);
    }

    return () => {
      priceWs.close();
    };
  }, [selectedCrypto, selectedTimeframe, selectedChartType, isFullscreen]);

  return (
    <div className={`bg-black rounded-2xl shadow-2xl overflow-hidden border border-gray-800 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl px-2 md:text-2xl font-bold text-white flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
                Pro Trading View
              </span>
              <span className="ml-2 text-xs bg-gradient-to-r from-red-600 to-red-800 px-2 py-0.5 rounded-full text-white">LIVE</span>
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Chart Type Selector */}
            <div className="bg-gray-900 rounded-lg p-1 flex">
              {chartTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedChartType(type.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    selectedChartType === type.value
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <type.icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
            
            {/* Timeframe Selector */}
            <div className="bg-gray-900 rounded-lg p-1 hidden md:flex">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe.value}
                  onClick={() => setSelectedTimeframe(timeframe.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    selectedTimeframe === timeframe.value
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {timeframe.label}
                </button>
              ))}
            </div>
            
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white p-2 rounded-lg transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Timeframe Selector */}
        <div className="md:hidden mt-3 overflow-x-auto scrollbar-hide">
          <div className="bg-gray-900 rounded-lg p-1 flex space-x-1 w-max">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Crypto Selector */}
      <div className="bg-gray-900 px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 md:gap-3">
          {cryptoList.map((crypto) => (
            <motion.button
              key={crypto.symbol}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCrypto(crypto.symbol)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                selectedCrypto === crypto.symbol
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <crypto.icon className="h-4 w-4" style={{ color: crypto.color }} />
              <div className="flex flex-col">
                <span className="font-medium">{crypto.name}</span>
                <div className="flex items-center space-x-1">
                  <span className="font-mono text-xs">${prices[crypto.symbol] || '0.00'}</span>
                  {priceChanges[crypto.symbol] && (
                    <span className={`text-xs flex items-center ${priceChanges[crypto.symbol].isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {priceChanges[crypto.symbol].isPositive ? <HiTrendingUp className="h-3 w-3" /> : <HiTrendingDown className="h-3 w-3" />}
                      {priceChanges[crypto.symbol].percent}%
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* TradingView Chart */}
      <div className={`tradingview-widget-container ${isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[500px] md:h-[650px]'}`} ref={container}>
        <div className="tradingview-widget-container__widget h-full"></div>
      </div>
      
      {/* Market Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-gradient-to-b from-gray-900 to-black">
        {cryptoList.map((crypto) => (
          <motion.div
            key={`${crypto.symbol}-overview`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-lg p-3 border border-gray-700 shadow-lg"
          >
                       <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <crypto.icon className="h-5 w-5" style={{ color: crypto.color }} />
                <span className="text-white font-medium">{crypto.name}</span>
              </div>
              {priceChanges[crypto.symbol] && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  priceChanges[crypto.symbol].isPositive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {priceChanges[crypto.symbol].isPositive ? '+' : ''}{priceChanges[crypto.symbol].percent}%
                </span>
              )}
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <span className="text-gray-400 text-xs">Price</span>
                <div className="text-white text-lg font-bold font-mono">
                  ${prices[crypto.symbol] || '0.00'}
                </div>
              </div>
              
              <div className="h-10 w-24">
                <MiniChart symbol={crypto.symbol} color={priceChanges[crypto.symbol]?.isPositive ? '#10B981' : '#EF4444'} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Bottom Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-gray-800 border-t border-gray-700">
        {cryptoList.slice(0, 6).map((crypto) => (
          <div 
            key={`${crypto.symbol}-stats`}
            className="bg-black py-3 px-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <crypto.icon className="h-3.5 w-3.5" style={{ color: crypto.color }} />
                <span className="text-gray-400 text-xs">{crypto.name}</span>
              </div>
              {priceChanges[crypto.symbol] && (
                <span className={`text-xs ${
                  priceChanges[crypto.symbol].isPositive 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {priceChanges[crypto.symbol].isPositive ? '↑' : '↓'} {priceChanges[crypto.symbol].percent}%
                </span>
              )}
            </div>
            <div className="text-white text-sm font-medium mt-1 font-mono">
              ${prices[crypto.symbol] || '0.00'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mini chart component for the market overview cards
function MiniChart({ symbol, color }) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Simulate chart data
    const generateRandomData = () => {
      const points = [];
      let lastValue = Math.random() * 10 + 45;
      
      for (let i = 0; i < 20; i++) {
        lastValue += (Math.random() - 0.5) * 2;
        points.push(lastValue);
      }
      
      return points;
    };
    
    setData(generateRandomData());
    
    // Update data periodically
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        newData.shift();
        newData.push(newData[newData.length - 1] + (Math.random() - 0.5) * 2);
        return newData;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [symbol]);
  
  // Calculate chart dimensions
  const width = 24 * 4;
  const height = 10 * 4;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  // Generate SVG path
  const path = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${index === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
