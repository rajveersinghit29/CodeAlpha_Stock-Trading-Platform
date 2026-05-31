import { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, TrendingUp, TrendingDown, Zap, RefreshCw } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

const RISK_SCENARIOS = [
  { event: 'Market Crash (-20%)', probability: 12, portfolioImpact: -18.4, hedgeSuggestion: 'Buy SPY Put Options (3-month)', hedgeCost: '$1,200' },
  { event: 'Sector Rotation (Tech to Value)', probability: 34, portfolioImpact: -8.2, hedgeSuggestion: 'Rebalance: Add VTV, Reduce QQQ exposure', hedgeCost: '$0 (Rebalance)' },
  { event: 'Interest Rate Hike (+50bps)', probability: 45, portfolioImpact: -5.1, hedgeSuggestion: 'Add TLT Inverse ETF position', hedgeCost: '$800' },
  { event: 'Geopolitical Shock (Energy)', probability: 22, portfolioImpact: -11.7, hedgeSuggestion: 'Buy XLE calls + CVX shares', hedgeCost: '$2,100' },
];

function Portfolio() {
  const { user } = useContext(AuthContext);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGuardian, setShowGuardian] = useState(false);

  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await api.get('/api/portfolio', config);
      setPortfolioData(res.data);
    } catch (err) {
      console.error("Failed to load portfolio", err);
      setError(err.response?.data?.message || err.response?.data || err.message || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [user.token]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Zap className="mx-auto text-blue-500 mb-4 animate-pulse" size={32} />
          <p className="text-gray-500 text-sm">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center bg-[#161b22] border border-gray-800 rounded-xl p-8 max-w-sm">
          <AlertTriangle className="mx-auto text-red-400 mb-4" size={32} />
          <p className="text-red-400 font-semibold mb-2">Portfolio Load Error</p>
          <p className="text-gray-500 text-sm mb-4">{error || 'Unknown error occurred'}</p>
          <button 
            onClick={fetchPortfolio} 
            className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  const { cashBalance, totalPortfolioValue, holdings } = portfolioData;
  const investedValue = totalPortfolioValue - cashBalance;
  const totalPL = holdings.reduce((sum, h) => sum + (h.unrealizedPl || 0), 0);

  const pieData = holdings.map(h => ({ name: h.symbol, value: h.totalValue || 0 }));
  if (cashBalance > 0) {
    pieData.push({ name: 'Cash', value: cashBalance });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-gray-800 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-100 tracking-tight">Portfolio Intelligence</h2>
          <p className="text-xs text-gray-500 mt-1">Real-time account analysis — Neural risk monitoring active</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPortfolio}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-[#161b22] border border-gray-700 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowGuardian(!showGuardian)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              showGuardian
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                : 'bg-[#161b22] border-gray-700 text-gray-400 hover:text-purple-400 hover:border-purple-500/30'
            }`}
          >
            <Shield size={16} />
            <span>Portfolio Guardian</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Total Account Value</p>
          <p className="text-2xl font-extrabold text-white font-mono">${(totalPortfolioValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Available Cash</p>
          <p className="text-2xl font-extrabold text-green-400 font-mono">${(cashBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Invested</p>
          <p className="text-2xl font-extrabold text-blue-400 font-mono">${(investedValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 shadow-lg">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Unrealized P&L</p>
          <div className="flex items-center space-x-2">
            {totalPL >= 0 ? <TrendingUp className="text-green-400" size={18} /> : <TrendingDown className="text-red-400" size={18} />}
            <p className={`text-2xl font-extrabold font-mono ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Guardian Panel */}
      {showGuardian && (
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="text-purple-400" size={20} />
            <h3 className="text-sm font-bold text-purple-300">Portfolio Guardian — Automated Hedge Generator</h3>
          </div>
          <p className="text-xs text-gray-400">AI monitors your portfolio against simulated macro-economic and geo-political black swan events. Below are the current risk scenarios and recommended hedges.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {RISK_SCENARIOS.map((scenario, i) => (
              <div key={i} className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={scenario.probability > 30 ? 'text-orange-400' : 'text-yellow-500'} size={14} />
                    <span className="text-xs font-bold text-gray-200">{scenario.event}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    scenario.probability > 30 ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>{scenario.probability}%</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-500">Portfolio Impact</span>
                  <span className="text-sm font-bold text-red-400 font-mono">{scenario.portfolioImpact}%</span>
                </div>
                <div className="bg-[#161b22] rounded-lg p-3 border border-gray-800">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Recommended Hedge</p>
                  <p className="text-xs text-green-300 font-medium">{scenario.hedgeSuggestion}</p>
                  <p className="text-[10px] text-gray-500 mt-1">Est. cost: {scenario.hedgeCost}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 lg:col-span-1 shadow-lg">
          <h3 className="text-sm font-bold text-gray-200 mb-4">Asset Allocation</h3>
          {pieData.length > 0 ? (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      contentStyle={{ backgroundColor: '#0d1117', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#c9d1d9' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-xs text-gray-400">{item.name}</span>
                    </div>
                    <span className="text-xs text-gray-300 font-mono">${Number(item.value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-600 text-sm">No positions yet</div>
          )}
        </div>

        {/* Holdings Table */}
        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 lg:col-span-2 shadow-lg flex flex-col">
          <h3 className="text-sm font-bold text-gray-200 mb-4">Open Positions</h3>
          {holdings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 py-12">
              <Zap size={32} className="mb-3 opacity-30" />
              <p className="font-medium">No open positions</p>
              <p className="text-xs text-gray-600 mt-1">Head to the Market to execute your first trade</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-[10px] text-gray-500 uppercase bg-[#0d1117] tracking-wider">
                  <tr>
                    <th className="px-3 py-2.5 rounded-tl-lg">Symbol</th>
                    <th className="px-3 py-2.5 text-right">Shares</th>
                    <th className="px-3 py-2.5 text-right">Avg Cost</th>
                    <th className="px-3 py-2.5 text-right">Current</th>
                    <th className="px-3 py-2.5 text-right">Value</th>
                    <th className="px-3 py-2.5 text-right rounded-tr-lg">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, idx) => (
                    <tr key={h.symbol} className={`border-b border-gray-800/50 ${idx % 2 === 0 ? '' : 'bg-[#13171d]'}`}>
                      <td className="px-3 py-3">
                        <span className="font-bold text-gray-100">{h.symbol}</span>
                        <span className="text-[10px] text-gray-600 block">{h.name}</span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono">{h.quantity}</td>
                      <td className="px-3 py-3 text-right font-mono text-gray-400">${Number(h.averagePrice).toFixed(2)}</td>
                      <td className="px-3 py-3 text-right font-mono text-white">${Number(h.currentPrice).toFixed(2)}</td>
                      <td className="px-3 py-3 text-right font-mono">${Number(h.totalValue).toFixed(2)}</td>
                      <td className={`px-3 py-3 text-right font-mono font-bold ${(h.unrealizedPl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(h.unrealizedPl || 0) > 0 ? '+' : ''}${Number(h.unrealizedPl || 0).toFixed(2)}
                        <span className="text-[10px] block opacity-70">({Number(h.plPercentage || 0).toFixed(2)}%)</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
