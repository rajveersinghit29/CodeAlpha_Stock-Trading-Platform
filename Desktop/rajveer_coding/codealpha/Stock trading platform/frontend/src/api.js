import axios from 'axios';

// ─── Backend URL ────────────────────────────────────────────────────────────
// In production (Vercel), set VITE_BACKEND_URL to your deployed backend URL.
// If not set, the app runs in DEMO MODE with a simulated backend.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const DEMO_MODE = !BACKEND_URL;

// ─── Axios instance ─────────────────────────────────────────────────────────
const api = axios.create({ baseURL: BACKEND_URL });

// ─── Demo Mode Mock Data ─────────────────────────────────────────────────────
const DEMO_STOCKS = {
  AAPL: { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 189.84 },
  MSFT: { symbol: 'MSFT', name: 'Microsoft Corp.', currentPrice: 415.32 },
  GOOGL: { symbol: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 175.49 },
  NVDA: { symbol: 'NVDA', name: 'NVIDIA Corp.', currentPrice: 1087.27 },
  TSLA: { symbol: 'TSLA', name: 'Tesla Inc.', currentPrice: 177.58 },
  AMZN: { symbol: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 183.75 },
  META: { symbol: 'META', name: 'Meta Platforms', currentPrice: 509.11 },
  JPM: { symbol: 'JPM', name: 'JPMorgan Chase', currentPrice: 198.44 },
};

// Simulated demo user store
const demoStore = {
  users: { demo: 'demo123', trader: 'pass1234' },
  portfolio: {
    cashBalance: 85420.50,
    totalPortfolioValue: 114250.75,
    holdings: [
      { symbol: 'AAPL', name: 'Apple Inc.', quantity: 25, averagePrice: 172.40, currentPrice: 189.84, totalValue: 4746.00, unrealizedPl: 436.00, plPercentage: 10.12 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 15, averagePrice: 390.10, currentPrice: 415.32, totalValue: 6229.80, unrealizedPl: 378.30, plPercentage: 6.47 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', quantity: 8, averagePrice: 950.00, currentPrice: 1087.27, totalValue: 8698.16, unrealizedPl: 1098.16, plPercentage: 14.49 },
    ],
  },
};

// ─── Mock interceptor (only active in demo mode) ─────────────────────────────
if (DEMO_MODE) {
  api.interceptors.request.use(async (config) => {
    const { method, url } = config;
    const path = url || '';

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));

    // POST /api/auth/register
    if (method === 'post' && path.includes('/api/auth/register')) {
      const body = JSON.parse(config.data || '{}');
      if (demoStore.users[body.username]) {
        return Promise.reject({ response: { status: 409, data: 'Username already exists' } });
      }
      demoStore.users[body.username] = body.password;
      return Promise.reject({
        response: {
          status: 200,
          data: 'User registered successfully',
          config,
          headers: {},
          __mock: true,
        },
      });
    }

    // POST /api/auth/login
    if (method === 'post' && path.includes('/api/auth/login')) {
      const body = JSON.parse(config.data || '{}');
      if (demoStore.users[body.username] === body.password) {
        return Promise.reject({
          response: {
            status: 200,
            data: { token: `demo-jwt-${body.username}-${Date.now()}`, username: body.username },
            config,
            headers: {},
            __mock: true,
          },
        });
      }
      return Promise.reject({ response: { status: 401, data: 'Invalid username or password' } });
    }

    // GET /api/portfolio
    if (method === 'get' && path.includes('/api/portfolio')) {
      return Promise.reject({
        response: {
          status: 200,
          data: demoStore.portfolio,
          config,
          headers: {},
          __mock: true,
        },
      });
    }

    // POST /api/trade/buy or /api/trade/sell
    if (method === 'post' && path.includes('/api/trade/')) {
      return Promise.reject({
        response: {
          status: 200,
          data: { message: 'Trade executed successfully (Demo Mode)' },
          config,
          headers: {},
          __mock: true,
        },
      });
    }

    return config;
  });

  // Turn __mock: true responses into resolved promises
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.__mock) {
        return Promise.resolve(err.response);
      }
      return Promise.reject(err);
    }
  );
}

export { DEMO_MODE, DEMO_STOCKS };
export default api;
