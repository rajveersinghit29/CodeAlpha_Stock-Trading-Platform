import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LineChart, Lock, User, DollarSign } from 'lucide-react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', { username, password });
      alert('Account created! You have been credited $100,000 in virtual trading capital.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d1117] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-600/5 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <LineChart className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">STX ULTIMA</h1>
            <p className="text-xs text-emerald-400 tracking-[0.3em] font-medium">CREATE YOUR ACCOUNT</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161b22]/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 shadow-2xl shadow-black/50">
          <h2 className="text-xl font-bold mb-1 text-gray-100">Join the Platform</h2>
          <p className="text-sm text-gray-500 mb-6">Start with $100,000 in virtual trading capital</p>

          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 mb-6 flex items-center space-x-3">
            <DollarSign className="text-emerald-400" size={20} />
            <p className="text-emerald-300 text-sm font-medium">New accounts receive $100,000 simulated balance</p>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-600" size={18} />
              <input 
                className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all" 
                placeholder="Choose a username"
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-600" size={18} />
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                placeholder="Create a strong password"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>
          <button 
            className="w-full bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white py-3 rounded-lg font-bold tracking-wide transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Initialize Trading Account'}
          </button>
          <p className="mt-5 text-center text-gray-500 text-sm">
            Already a trader? <a href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Sign In</a>
          </p>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">STX Ultima v2.0 — Powered by Neural Market Intelligence</p>
      </div>
    </div>
  );
}

export default Register;
