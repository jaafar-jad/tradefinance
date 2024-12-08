"use client";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiDogecoin, SiLitecoin, SiRipple, SiCardano, SiSolana, SiBinance } from 'react-icons/si';

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

export default function TradingViewChart() {
  const container = useRef();
  const [selectedCrypto, setSelectedCrypto] = useState("BTCUSDT");
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const priceWs = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    
    priceWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const updatedPrices = {};
      
      data.forEach(ticker => {
        if (cryptoList.some(crypto => crypto.symbol === ticker.s)) {
          updatedPrices[ticker.s] = parseFloat(ticker.c).toFixed(2);
        }
      });
      
      setPrices(prev => ({...prev, ...updatedPrices}));
    };

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
    {
      "width": "100%",
      "height": "${window.innerWidth < 768 ? '400' : '550'}",
      "symbol": "BINANCE:${selectedCrypto}",
      "interval": "1",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
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
  }, [selectedCrypto]);

  return (
    <div className="bg-gradient-to-r from-white/70 via-red-200 to-white/80 px-2 py-2 rounded shadow-2xl">
      <div className={`mb-4 bg-gradient-to-br from-red-600 via-black to-red-700  p-4 h-full rounded-xl border border-white/10`}>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 italic">Live Trades</h2>      
        <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {cryptoList.map((crypto, index) => (
            <motion.button
              key={`${crypto.symbol}-${index}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCrypto(crypto.symbol)}
              className={`flex items-center space-x-1 md:space-x-2 px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-sm transition-all duration-200 ${
                selectedCrypto === crypto.symbol
                  ? 'bg-gradient-to-r from-red-900 via-red-800 to-black text-white shadow-lg'
                  : 'bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-300 hover:from-red-900 hover:to-black'
              }`}
            >
              <crypto.icon className="h-3 w-3 md:h-4 md:w-4" style={{ color: crypto.color }} />
              <span className="hidden md:inline">{crypto.name}</span>
              <span className="inline md:hidden">{crypto.name.substring(0, 3)}</span>
              <span className="font-mono text-xs">
                ${prices[crypto.symbol] || '0.00'}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="tradingview-widget-container h-[40vh] md:h-[60vh]" ref={container}>
        <div className="tradingview-widget-container__widget h-full"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
        {cryptoList.map((crypto, index) => (
          <motion.div
            key={`${crypto.symbol}-bottom-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-red-900 via-black to-red-950 p-2 md:p-3 rounded-lg border border-red-900/20 shadow-xl"
          >
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <crypto.icon className="h-3 w-3 md:h-4 md:w-4" style={{ color: crypto.color }} />
              <span className="text-gray-300 text-[10px] md:text-xs">{crypto.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-[10px] md:text-sm font-bold">
                ${prices[crypto.symbol] || '0.00'}
              </span>
              <span className="text-green-400 text-[8px] md:text-xs">+2.4%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

