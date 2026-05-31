import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { TrendingUp, TrendingDown, Search, ArrowRight, Brain, Shield, Globe, Zap, Activity, AlertTriangle, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Simulated sentiment data generator
function generateSentiment(symbol) {
  const sentiments = [
    { label: 'Extremely Bullish', score: 92, color: 'text-green-400', bg: 'bg-green-500/10', sources: ['Reuters NLP', 'Twitter/X Firehose', 'SEC Filings'], signal: 'STRONG BUY' },
    { label: 'Bullish', score: 78, color: 'text-green-300', bg: 'bg-green-500/10', sources: ['Bloomberg Feed', 'Reddit WSB', 'Earnings Call NLP'], signal: 'BUY' },
    { label: 'Neutral', score: 52, color: 'text-yellow-300', bg: 'bg-yellow-500/10', sources: ['News Aggregate', 'Options Flow', 'Insider Trades'], signal: 'HOLD' },
    { label: 'Bearish', score: 31, color: 'text-red-300', bg: 'bg-red-500/10', sources: ['CNBC Analysis', 'Short Interest', 'Bond Yields'], signal: 'SELL' },
    { label: 'Very Bullish', score: 85, color: 'text-green-400', bg: 'bg-green-500/10', sources: ['Institutional Flow', 'Dark Pool Data', 'Patent Filings'], signal: 'BUY' },
  ];
  const hash = symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return sentiments[hash % sentiments.length];
}

// Simulated geo-political alerts
const GEO_ALERTS = [
  { region: 'Asia-Pacific', event: 'Semiconductor export restrictions tightening', impact: 'HIGH', affectedSymbols: ['NVDA', 'AAPL', 'MSFT'], probability: 87 },
  { region: 'Middle East', event: 'Energy supply corridor disruption risk', impact: 'CRITICAL', affectedSymbols: ['CVX', 'BTC', 'ETH'], probability: 64 },
  { region: 'North America', event: 'Federal Reserve rate decision pending', impact: 'MEDIUM', affectedSymbols: ['JPM', 'V', 'MA'], probability: 91 },
  { region: 'Europe', event: 'Consumer spending data release imminent', impact: 'LOW', affectedSymbols: ['PG', 'KO', 'PEP'], probability: 45 },
];

// Simulated liquidity depth data
function generateDepthData(price) {
  const data = [];
  for (let i = -8; i <= 8; i++) {
    const level = price + (i * price * 0.002);
    const visible = Math.random() * 5000 + 500;
    const dark = Math.random() * 12000;
    data.push({
      price: level.toFixed(2),
      visibleBids: i < 0 ? visible : 0,
      visibleAsks: i > 0 ? visible : 0,
      darkPool: dark,
    });
  }
  return data;
}

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stocks, setStocks] = useState({});
  const [selectedStockSymbol, setSelectedStockSymbol] = useState(null);
  const [search, setSearch] = useState("");
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [trading, setTrading] = useState(false);
  const [priceHistory, setPriceHistory] = useState({});
  const [activePanel, setActivePanel] = useState('chart'); // chart | sentiment | depth | geo

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      onConnect: () => {
        client.subscribe('/topic/stocks', (message) => {
          const stock = JSON.parse(message.body);
          setStocks(prev => ({ ...prev, [stock.symbol]: stock }));
          setPriceHistory(prev => {
            const hist = prev[stock.symbol] || [];
            const newHist = [...hist, { time: new Date().toLocaleTimeString(), price: stock.currentPrice }];
            if (newHist.length > 30) newHist.shift();
            return { ...prev, [stock.symbol]: newHist };
          });
        });
      },
    });
    client.activate();
    return () => client.deactivate();
  }, []);

  const handleTrade = async (type) => {
    if (!selectedStockSymbol || orderQuantity <= 0) return;
    setTrading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`/api/trade/${type.toLowerCase()}`, { symbol: selectedStockSymbol, quantity: orderQuantity }, config);
      alert(`${type} order for ${orderQuantity} ${selectedStockSymbol} executed successfully!`);
      setOrderQuantity(1);
    } catch (err) {
      alert(`Trade failed: ${err.response?.data?.message || err.response?.data || err.message}`);
    } finally {
      setTrading(false);
    }
  };

  const filteredStocks = useMemo(() => {
    return Object.values(stocks).filter(s =>
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [stocks, search]);

  const selectedStock = selectedStockSymbol ? stocks[selectedStockSymbol] : null;
  const selectedHistory = selectedStockSymbol ? (priceHistory[selectedStockSymbol] || []) : [];
  const sentiment = selectedStockSymbol ? generateSentiment(selectedStockSymbol) : null;
  const depthData = selectedStock ? generateDepthData(selectedStock.currentPrice) : [];

  const panelTabs = [
    { id: 'chart', label: 'Price Chart', icon: <Activity size={14} /> },
    { id: 'sentiment', label: 'AI Sentiment', icon: <Brain size={14} /> },
    { id: 'depth', label: 'Liquidity Map', icon: <BarChart3 size={14} /> },
    { id: 'sim', label: 'Algo Sim', icon: <Zap size={14} /> },
    { id: 'geo', label: 'Geo Impact', icon: <Globe size={14} /> },
  ];

  return (
    <div className="flex h-full flex-col lg:flex-row bg-transparent relative z-10">
      {/* LEFT PANEL: Market Screener */}
      <div className="flex-1 p-5 border-r border-white/10 flex flex-col h-full overflow-hidden bg-black/40 backdrop-blur-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-widest glow-text-cyan">MARKET_SCREENER</h2>
            <p className="text-xs text-gray-500">{Object.keys(stocks).length} instruments • Live</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-600" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/50 border border-cyan-500/30 text-cyan-50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] w-48 transition-all"
            />
          </div>
        </div>

        {/* Geo-Impact Banner */}
        <div className="mb-4 bg-red-900/20 border border-red-500/40 rounded-lg p-3 flex items-start space-x-3 shadow-[0_0_15px_rgba(255,0,0,0.1)]">
          <AlertTriangle className="text-red-500 drop-shadow-[0_0_5px_rgba(255,0,0,0.8)] mt-0.5 flex-shrink-0 animate-pulse" size={16} />
          <div className="text-xs">
            <span className="font-bold text-red-400 tracking-widest glow-text-magenta">GEO-IMPACT ALERT: </span>
            <span className="text-gray-300">{GEO_ALERTS[0].event} — </span>
            <span className="text-red-400 font-mono font-bold">{GEO_ALERTS[0].probability}% probability</span>
            <span className="text-gray-500"> • Affects: {GEO_ALERTS[0].affectedSymbols.join(', ')}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-black/30 shadow-inner custom-scrollbar">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-[10px] text-cyan-500/70 uppercase bg-black/60 sticky top-0 z-10 tracking-[0.1em] backdrop-blur-md">
              <tr>
                <th className="px-3 py-2.5">Symbol</th>
                <th className="px-3 py-2.5 hidden xl:table-cell">Company</th>
                <th className="px-3 py-2.5 text-right">Price</th>
                <th className="px-3 py-2.5 text-center">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => {
                const isSelected = selectedStockSymbol === stock.symbol;
                const s = generateSentiment(stock.symbol);
                return (
                  <tr
                    key={stock.symbol}
                    onClick={() => { setSelectedStockSymbol(stock.symbol); setActivePanel('chart'); }}
                    className={`border-b border-white/5 cursor-pointer transition-colors ${isSelected ? 'bg-cyan-900/30 border-l-2 border-l-cyan-400 shadow-[inset_0_0_20px_rgba(0,240,255,0.1)]' : 'hover:bg-white/5'}`}
                  >
                    <td className="px-3 py-2.5">
                      <span className="font-bold text-gray-100">{stock.symbol}</span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs hidden xl:table-cell">{stock.name}</td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold text-white text-sm">${stock.currentPrice.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.signal}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {Object.keys(stocks).length === 0 && (
            <div className="text-center p-12">
              <Activity className="mx-auto text-blue-500 mb-4 animate-pulse" size={32} />
              <p className="text-gray-500 text-sm">Connecting to Neural Exchange...</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Intelligence Terminal */}
      <div className="w-full lg:w-[480px] xl:w-[560px] bg-black/60 backdrop-blur-xl flex flex-col h-full overflow-y-auto border-l border-cyan-500/20 relative z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
        {!selectedStock ? (
          <div className="h-full flex flex-col items-center justify-center text-cyan-500/50 px-8 relative overflow-hidden">
            <div className="absolute inset-0 energy-wave opacity-20"></div>
            <div className="w-24 h-24 rounded-full bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,240,255,0.1)] relative z-10">
              <Zap size={40} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            </div>
            <p className="font-semibold text-gray-500">Select an instrument</p>
            <p className="text-sm text-gray-600 mt-1 text-center">Click any stock from the screener to activate the Intelligence Terminal</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Stock Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-gradient-to-b from-cyan-900/10 to-transparent relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">{selectedStock.symbol}</h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sentiment.bg} ${sentiment.color}`}>{sentiment.signal}</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">{selectedStock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-white font-mono drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">${selectedStock.currentPrice.toFixed(2)}</p>
                <p className="text-xs text-cyan-400 font-bold flex items-center justify-end space-x-1 mt-1 tracking-widest">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(0,240,255,1)]"></span>
                  <span>LIVE_FEED</span>
                </p>
              </div>
            </div>

            {/* Intelligence Tabs */}
            <div className="flex border-b border-white/10 bg-black/40 px-2 pt-2">
              {panelTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActivePanel(tab.id)}
                  className={`flex items-center space-x-1.5 px-4 py-3 text-xs font-bold transition-all border-b-2 rounded-t-lg ${
                    activePanel === tab.id
                      ? 'border-cyan-400 text-cyan-400 bg-cyan-900/20 shadow-[0_-5px_10px_rgba(0,240,255,0.05)]'
                      : 'border-transparent text-gray-500 hover:text-cyan-200/50 hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {activePanel === 'chart' && (
                <>
                  <div className="h-64 bg-black/40 rounded-xl border border-white/10 p-3 shadow-inner relative overflow-hidden">
                    {/* Glowing energy wave overlay on the chart */}
                    <div className="absolute inset-0 energy-wave opacity-30 mix-blend-screen pointer-events-none"></div>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedHistory}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff00ff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ff00ff" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: '#00f0ff', color: '#c9d1d9', borderRadius: '8px', fontSize: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 0 10px rgba(0,240,255,0.2)' }}
                          labelStyle={{ color: '#00f0ff' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="#00f0ff" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
                        {/* Sentiment Volatility Overlay */}
                        <Area type="monotone" dataKey={(d) => d.price * (1 + (Math.random() * 0.04 - 0.02))} stroke="#ff00ff" strokeWidth={1} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorSentiment)" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                    {/* Overlay badges */}
                    <div className="absolute top-4 left-4 bg-black/60 border border-cyan-500/50 rounded p-1.5 backdrop-blur shadow-[0_0_5px_rgba(0,240,255,0.3)]">
                      <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">Sentiment AI Overlay: Active</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5 shadow-inner">
                      <p className="text-[10px] text-cyan-500/70 uppercase tracking-widest glow-text-cyan">AI Score</p>
                      <p className={`text-xl font-bold ${sentiment.color} drop-shadow-[0_0_5px_currentColor]`}>{sentiment.score}/100</p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5 shadow-inner">
                      <p className="text-[10px] text-cyan-500/70 uppercase tracking-widest glow-text-cyan">Volume</p>
                      <p className="text-xl font-bold text-gray-200">{(Math.random() * 50 + 10).toFixed(1)}M</p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5 shadow-inner">
                      <p className="text-[10px] text-cyan-500/70 uppercase tracking-widest glow-text-cyan">Volatility</p>
                      <p className="text-xl font-bold text-magenta-400 drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]">{(Math.random() * 3 + 0.5).toFixed(1)}%</p>
                    </div>
                  </div>
                </>
              )}

              {activePanel === 'sentiment' && (
                <div className="space-y-4">
                  <div className={`bg-black/60 border ${sentiment.color === 'text-green-400' || sentiment.color === 'text-green-300' ? 'border-green-500/40 shadow-[0_0_15px_rgba(0,255,102,0.1)]' : sentiment.color === 'text-red-300' ? 'border-red-500/40 shadow-[0_0_15px_rgba(255,0,0,0.1)]' : 'border-yellow-500/40 shadow-[0_0_15px_rgba(255,255,0,0.1)]'} rounded-xl p-5 relative overflow-hidden`}>
                    <div className="absolute inset-0 energy-wave opacity-10"></div>
                    <div className="flex items-center space-x-2 mb-3 relative z-10">
                      <Brain className={sentiment.color} size={20} />
                      <h3 className="text-sm font-bold text-gray-200 tracking-widest">Predictive Sentiment AI</h3>
                    </div>
                    <div className="flex items-end justify-between mb-4 relative z-10">
                      <div>
                        <p className={`text-4xl font-extrabold ${sentiment.color} drop-shadow-[0_0_10px_currentColor]`}>{sentiment.score}</p>
                        <p className="text-xs text-cyan-500/70 uppercase tracking-widest mt-1">Neural Confidence</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${sentiment.color} tracking-wider`}>{sentiment.label}</p>
                        <p className="text-xs text-gray-400 mt-1">Signal: <span className="font-bold text-white">{sentiment.signal}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Neural Map Visual */}
                  <div className="bg-black/40 rounded-xl border border-white/10 p-4 shadow-inner">
                    <h4 className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-[0.2em] mb-4">Cross-Market Neural Correlation Map</h4>
                    <div className="relative h-48 rounded-lg border border-white/5 bg-[#05080f] overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,240,255,0.1)_0%,_transparent_70%)]"></div>
                      
                      {/* Central Node */}
                      <div className="absolute z-20 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-cyan-900/80 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.6)] z-20">
                          <span className="text-white font-bold text-xs">{selectedStockSymbol}</span>
                        </div>
                      </div>

                      {/* Correlated Nodes */}
                      {['AAPL', 'BTC', 'GLD', 'TSLA', 'USO'].map((sym, i) => {
                        const angle = (i / 5) * Math.PI * 2;
                        const radius = 65;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        const corr = (Math.random() * 2 - 1);
                        const isPos = corr > 0;
                        const color = isPos ? 'rgba(0, 255, 102, 0.8)' : 'rgba(255, 0, 85, 0.8)';
                        
                        return (
                          <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <svg className="absolute w-full h-full" style={{ zIndex: 10 }}>
                              <line 
                                x1="50%" y1="50%" 
                                x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`} 
                                stroke={color} 
                                strokeWidth={Math.abs(corr) * 3 + 1}
                                strokeDasharray={Math.abs(corr) > 0.5 ? "" : "4 4"}
                                className="opacity-60"
                              />
                            </svg>
                            <div 
                              className="absolute w-8 h-8 rounded-full bg-black border flex items-center justify-center z-20 shadow-[0_0_10px_currentColor]"
                              style={{ 
                                transform: `translate(${x}px, ${y}px)`,
                                borderColor: color,
                                color: color
                              }}
                            >
                              <span className="text-[9px] font-bold text-white">{sym}</span>
                            </div>
                            <div 
                              className="absolute text-[8px] font-mono font-bold bg-black/80 px-1 rounded z-30"
                              style={{ 
                                transform: `translate(${x * 0.5}px, ${y * 0.5 - 10}px)`,
                                color: color
                              }}
                            >
                              {corr > 0 ? '+' : ''}{corr.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'depth' && (
                <div className="space-y-4">
                  <div className="bg-black/40 rounded-xl border border-white/10 p-4 shadow-inner">
                    <div className="flex items-center space-x-2 mb-4">
                      <BarChart3 className="text-blue-500 drop-shadow-[0_0_5px_rgba(0,119,255,0.8)]" size={18} />
                      <h3 className="text-sm font-bold text-gray-200 tracking-widest uppercase">Quantum Flow Topography</h3>
                    </div>
                    <p className="text-xs text-cyan-500/50 mb-4 tracking-widest">Algorithmic modeling of Dark Pool liquidity vs Order Book</p>
                    <div className="h-64 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,119,255,0.1)_100%)] mix-blend-screen"></div>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={depthData}>
                          <defs>
                            <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00ff66" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#00ff66" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorAsks" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ff0055" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#ff0055" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorDark" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0077ff" stopOpacity={0.5} />
                              <stop offset="95%" stopColor="#0077ff" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="price" tick={{ fontSize: 9, fill: '#00f0ff', opacity: 0.7 }} interval={2} axisLine={false} tickLine={false} />
                          <YAxis tick={false} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: '#0077ff', borderRadius: '8px', fontSize: '11px', backdropFilter: 'blur(5px)' }}
                            itemStyle={{ color: '#c9d1d9' }}
                          />
                          <Area type="monotone" dataKey="darkPool" stroke="#0077ff" strokeWidth={0} fill="url(#colorDark)" name="Dark Pool (Est.)" isAnimationActive={false} />
                          <Area type="step" dataKey="visibleBids" stroke="#00ff66" strokeWidth={2} fill="url(#colorBids)" name="Visible Bids" isAnimationActive={false} />
                          <Area type="step" dataKey="visibleAsks" stroke="#ff0055" strokeWidth={2} fill="url(#colorAsks)" name="Visible Asks" isAnimationActive={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/60 border border-green-500/30 rounded-lg p-3 shadow-[0_0_10px_rgba(0,255,102,0.1)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-green-500/20 blur-xl"></div>
                      <p className="text-[10px] text-green-400 uppercase tracking-widest mb-1">Hidden Support Zone</p>
                      <p className="text-xl font-bold text-white font-mono drop-shadow-[0_0_5px_rgba(0,255,102,0.5)]">${(selectedStock.currentPrice * 0.97).toFixed(2)}</p>
                      <p className="text-[9px] text-gray-500 mt-1">Est. 45K shares (Dark Pool)</p>
                    </div>
                    <div className="bg-black/60 border border-red-500/30 rounded-lg p-3 shadow-[0_0_10px_rgba(255,0,85,0.1)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-red-500/20 blur-xl"></div>
                      <p className="text-[10px] text-red-400 uppercase tracking-widest mb-1">Hidden Resistance Wall</p>
                      <p className="text-xl font-bold text-white font-mono drop-shadow-[0_0_5px_rgba(255,0,85,0.5)]">${(selectedStock.currentPrice * 1.03).toFixed(2)}</p>
                      <p className="text-[9px] text-gray-500 mt-1">Est. 62K shares (Dark Pool)</p>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'sim' && (
                <div className="space-y-4">
                  <div className="bg-black/60 rounded-xl border border-white/10 p-5 shadow-[inset_0_0_20px_rgba(0,240,255,0.05)]">
                    <div className="flex items-center space-x-2 mb-4">
                      <Zap className="text-cyan-400 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" size={20} />
                      <h3 className="text-sm font-bold text-white tracking-widest uppercase">Real-Time Algorithmic Simulation</h3>
                    </div>
                    <p className="text-xs text-gray-400 mb-5">Define execution logic and forward-test against live websocket data feed.</p>
                    
                    {/* Strategy Builder UI */}
                    <div className="space-y-3 bg-black/40 p-4 rounded-lg border border-cyan-500/20">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-cyan-400 font-mono">IF</span>
                        <select className="bg-[#0a0e12] border border-white/10 text-white text-xs p-1.5 rounded outline-none">
                          <option>Price</option>
                          <option>Sentiment Score</option>
                          <option>Dark Pool Vol</option>
                        </select>
                        <select className="bg-[#0a0e12] border border-white/10 text-white text-xs p-1.5 rounded outline-none">
                          <option>{'<'}</option>
                          <option>{'>'}</option>
                          <option>{'='}</option>
                        </select>
                        <input type="text" defaultValue={(selectedStock.currentPrice * 0.99).toFixed(2)} className="bg-[#0a0e12] border border-white/10 text-white font-mono text-xs p-1.5 w-20 rounded outline-none" />
                      </div>
                      
                      <div className="flex items-center space-x-2 pl-4">
                        <span className="text-xs font-bold text-cyan-400 font-mono">AND</span>
                        <select className="bg-[#0a0e12] border border-white/10 text-white text-xs p-1.5 rounded outline-none">
                          <option>Sentiment AI</option>
                          <option>Geo-Impact</option>
                        </select>
                        <select className="bg-[#0a0e12] border border-white/10 text-white text-xs p-1.5 rounded outline-none">
                          <option>IS BULLISH</option>
                          <option>IS BEARISH</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2 border-t border-white/10 pt-3 mt-3">
                        <span className="text-xs font-bold text-magenta-400 font-mono">THEN</span>
                        <select className="bg-magenta-900/20 border border-magenta-500/30 text-magenta-100 text-xs p-1.5 rounded outline-none">
                          <option>EXECUTE BUY</option>
                          <option>EXECUTE SELL</option>
                        </select>
                        <input type="number" defaultValue="100" className="bg-[#0a0e12] border border-white/10 text-white font-mono text-xs p-1.5 w-16 rounded outline-none" />
                        <span className="text-xs text-gray-500">SHARES</span>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button className="flex items-center space-x-2 bg-cyan-900/40 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg font-bold text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <Activity size={14} className="animate-pulse" />
                        <span>RUN FORWARD TEST</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'geo' && (
                <div className="space-y-4">
                  <div className="bg-black/60 rounded-xl border border-white/10 p-4 shadow-inner">
                    <div className="flex items-center space-x-2 mb-4">
                      <Globe className="text-cyan-400 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" size={18} />
                      <h3 className="text-sm font-bold text-gray-200 tracking-widest">Geo-Political Impact Nexus</h3>
                    </div>
                    <p className="text-xs text-cyan-500/50 mb-4 tracking-widest uppercase">Real-time NLP analysis of global events</p>

                    {GEO_ALERTS.map((alert, i) => {
                      const isAffected = alert.affectedSymbols.includes(selectedStockSymbol);
                      return (
                        <div key={i} className={`p-3 rounded-lg mb-3 border relative overflow-hidden ${isAffected ? 'bg-red-900/20 border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.1)]' : 'bg-white/5 border-white/5'}`}>
                          {isAffected && <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>}
                          <div className="flex justify-between items-start mb-2 relative z-10">
                            <span className="text-xs font-bold text-gray-200 tracking-wider">{alert.region}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                              alert.impact === 'CRITICAL' ? 'bg-red-500/30 text-red-400 border border-red-500/50' :
                              alert.impact === 'HIGH' ? 'bg-orange-500/30 text-orange-400 border border-orange-500/50' :
                              alert.impact === 'MEDIUM' ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-500/50' :
                              'bg-gray-700/50 text-gray-400'
                            }`}>{alert.impact}</span>
                          </div>
                          <p className="text-xs text-gray-400 relative z-10">{alert.event}</p>
                          <div className="flex justify-between items-center mt-3 relative z-10 border-t border-white/5 pt-2">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Probability: <span className={`font-bold font-mono ${alert.probability > 70 ? 'text-red-400 drop-shadow-[0_0_2px_currentColor]' : 'text-yellow-400'}`}>{alert.probability}%</span></span>
                            {isAffected && <span className="text-[9px] text-red-400 font-bold animate-pulse tracking-widest">⚡ DIRECT IMPACT: {selectedStockSymbol}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Entry - Always visible */}
              <div className="bg-black/60 rounded-xl border border-cyan-500/20 p-5 space-y-4 shadow-[0_0_20px_rgba(0,240,255,0.05)] backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
                  <h3 className="text-sm font-bold text-white tracking-widest glow-text-cyan">ORDER ENTRY</h3>
                  <div className="flex items-center space-x-1.5 bg-green-900/30 px-2 py-1 rounded border border-green-500/30 shadow-[0_0_5px_rgba(0,255,102,0.2)]">
                    <Shield className="text-green-400" size={10} />
                    <span className="text-[9px] text-green-400 font-bold tracking-widest uppercase">Guardian Active</span>
                  </div>
                </div>

                <div className="relative z-10">
                  <label className="block text-[10px] font-bold text-cyan-500/70 mb-1 uppercase tracking-widest">Execution Shares</label>
                  <input
                    type="number"
                    min="1"
                    value={orderQuantity}
                    onChange={e => setOrderQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-cyan-500/30 text-white rounded-lg p-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] font-mono text-xl text-center transition-all"
                  />
                </div>

                <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5 relative z-10">
                  <span className="text-cyan-500/70 text-[10px] uppercase tracking-widest font-bold">Estimated Cost</span>
                  <span className="text-white font-bold font-mono text-lg drop-shadow-[0_0_5px_currentColor]">
                    ${(selectedStock.currentPrice * orderQuantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex space-x-4 relative z-10 pt-2">
                  <button
                    onClick={() => handleTrade('BUY')}
                    disabled={trading}
                    className="flex-1 bg-green-500/20 hover:bg-green-500/40 border border-green-500/50 disabled:opacity-30 text-green-400 py-3 rounded-lg font-bold text-sm tracking-widest transition-all shadow-[0_0_15px_rgba(0,255,102,0.2)] hover:shadow-[0_0_20px_rgba(0,255,102,0.4)]"
                  >
                    EXECUTE BUY
                  </button>
                  <button
                    onClick={() => handleTrade('SELL')}
                    disabled={trading}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 disabled:opacity-30 text-red-400 py-3 rounded-lg font-bold text-sm tracking-widest transition-all shadow-[0_0_15px_rgba(255,0,0,0.2)] hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]"
                  >
                    EXECUTE SELL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
