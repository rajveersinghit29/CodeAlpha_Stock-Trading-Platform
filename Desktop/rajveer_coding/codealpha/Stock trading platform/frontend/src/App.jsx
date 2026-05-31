import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import Login from './components/Login';
import Register from './components/Register';
import AuthContext from './context/AuthContext';
import { LineChart, Briefcase, LogOut, Activity, Zap, Shield } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ token, username });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    setUser(data);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    navigate('/login');
  };

  const navItems = [
    { name: 'Market Intelligence', path: '/', icon: <Activity size={18} /> },
    { name: 'Portfolio & Guardian', path: '/portfolio', icon: <Briefcase size={18} /> },
  ];

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="min-h-screen bg-transparent text-gray-300 flex font-sans relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-80 pointer-events-none"></div>
        <div className="energy-wave"></div>
        
        {user && (
          <aside className="w-64 glass-panel flex-col hidden md:flex z-10 relative">
            {/* Logo */}
            <div className="p-6 border-b border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-black/50 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                  <LineChart className="text-cyan-400 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-white tracking-widest glow-text-cyan">ULTIMA</h1>
                  <p className="text-[10px] text-cyan-400 tracking-[0.3em] font-medium opacity-80">STX SYSTEM v3</p>
                </div>
              </div>
            </div>

            {/* Features Badge */}
            <div className="px-5 pt-6 pb-2">
              <p className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-[0.2em] mb-3">Core Modules</p>
              <div className="bg-black/40 border border-white/5 rounded-lg p-3 space-y-2.5 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                <div className="flex items-center space-x-2">
                  <Zap className="text-cyan-400 drop-shadow-[0_0_2px_rgba(0,240,255,0.8)]" size={12} />
                  <span className="text-[10px] text-gray-300 font-medium tracking-wide">Predictive Sentiment AI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="text-magenta-400 drop-shadow-[0_0_2px_rgba(255,0,255,0.8)]" size={12} />
                  <span className="text-[10px] text-gray-300 font-medium tracking-wide">Neural Correlation Map</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="text-green-400 drop-shadow-[0_0_2px_rgba(0,255,102,0.8)]" size={12} />
                  <span className="text-[10px] text-gray-300 font-medium tracking-wide">Algorithmic Simulation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="text-blue-400 drop-shadow-[0_0_2px_rgba(0,119,255,0.8)]" size={12} />
                  <span className="text-[10px] text-gray-300 font-medium tracking-wide">Quantum Topography</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-4 space-y-2 mt-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm tracking-wide ${
                    location.pathname === item.path
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                      : 'hover:bg-white/5 text-gray-400 hover:text-gray-200 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>

            {/* User Section */}
            <div className="p-5 border-t border-white/5 bg-black/20">
              <div className="flex items-center space-x-3 px-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-black border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-sm font-bold shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-200 block">{user.username}</span>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">● Sys_Online</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
              >
                <LogOut size={14} />
                <span>Disconnect Protocol</span>
              </button>
            </div>
          </aside>
        )}

        <main className={`flex-1 flex flex-col z-10 relative`}>
          {user && (
            <header className="md:hidden glass-panel p-3 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-black border border-cyan-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                  <LineChart className="text-cyan-400" size={16} />
                </div>
                <span className="text-sm font-extrabold text-white tracking-widest glow-text-cyan">ULTIMA</span>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => navigate('/')} className={`text-xs px-3 py-1.5 rounded ${location.pathname === '/' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-500'}`}>Market</button>
                <button onClick={() => navigate('/portfolio')} className={`text-xs px-3 py-1.5 rounded ${location.pathname === '/portfolio' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-500'}`}>Portfolio</button>
                <button onClick={logout} className="text-red-400"><LogOut size={16} /></button>
              </div>
            </header>
          )}
          <div className="flex-1 overflow-hidden p-2 md:p-4">
            <div className="h-full rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-2xl relative">
              <Routes>
                <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/portfolio" element={user ? <Portfolio /> : <Navigate to="/login" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
