# STX Ultima: Next-Gen Neural Trading Intelligence

<p align="center">
  <em>A state-of-the-art, high-performance virtual trading platform powered by simulated algorithmic neural intelligence and a futuristic glassmorphic UI.</em>
</p>

![STX Ultima UI Mockup](docs/stx_ultima_mockup.png)

## 🚀 Overview

**STX Ultima** disrupts the retail trading market by bringing institutional-grade, predictive AI visualizations directly to the retail investor. Built with a stunning **glassmorphic**, futuristic interface, it moves beyond standard price charts to visualize hidden liquidity, market sentiment, and cross-market correlations in real time.

This platform bridges the gap between deep-data heavyweights (like Bloomberg) and accessible retail disruptors (like Robinhood). 

## ✨ Key Features

- **Holographic Glass Aesthetic:** A beautiful, responsive UI built with pure CSS glassmorphism, floating layouts, and smooth micro-animations.
- **Quantum Flow Topography:** Replaces standard volume bars with a topographic AreaChart visualization of order book depth, revealing "Hidden Support" and "Resistance" walls simulating dark pool liquidity.
- **Predictive Sentiment AI Map:** Overlays real-time AI sentiment volatility directly onto the price chart using dynamic visual gradients.
- **Cross-Market Neural Correlation Map:** A dynamic SVG web that visually connects correlated assets, illuminating hidden market relationships.
- **Real-Time Algorithmic Trade Simulations:** Define execution logic (e.g., `IF Price < $100 AND Sentiment IS BULLISH THEN EXECUTE BUY`) and forward-test it against live data.
- **Portfolio Guardian:** An automated hedge generator that monitors your portfolio against simulated macroeconomic "black swan" events.
- **Real-Time Websocket Data:** Live stock price streaming directly from the Spring Boot backend to the React frontend.

## 🏢 Enterprise Engineering
To demonstrate production readiness, this platform implements industry-standard DevOps and engineering practices:
- **Full Dockerization:** Separate `Dockerfile`s for the React and Spring Boot apps, orchestrated beautifully via `docker-compose.yml` and a custom Nginx reverse proxy.
- **CI/CD Pipeline:** A GitHub Actions workflow (`.github/workflows/ci.yml`) automatically builds and tests both the frontend and backend on every push.
- **Automated Testing:** Foundational integration testing using Spring Boot Test to ensure context stability.
- **Swagger API Documentation:** Fully automated, interactive REST API documentation generated via `springdoc-openapi`.

## 🛠 Technology Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** (v4.0) + Custom Glassmorphic Utilities
- **Recharts** (Complex topographic & overlapping charts)
- **Lucide React** (High-quality iconography)
- **Axios** (REST API)

### Backend
- **Spring Boot 3** (Java)
- **Spring Security** (Stateless JWT Authentication)
- **Spring WebSockets** (STOMP for live data streaming)
- **H2 In-Memory Database** (No complex setup required)
- **Maven**

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Java 17+

### 1. Start the Backend

```bash
cd backend
./mvnw clean package -DskipTests
./mvnw spring-boot:run
```
*The backend runs on `http://localhost:8080`.*

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173` (or similar).*

### 3. Usage
1. Open your browser and navigate to the frontend URL.
2. Click **Create Account** to register a new virtual trading account (you start with $100,000 in virtual capital).
3. Log in to access the **Intelligence Terminal**.

## 🛡 Security
- Fully stateless JWT authentication.
- Passwords hashed via BCrypt.
- Role-based access control (RBAC).

## 🔮 Future Roadmap
- Integration with live brokerage APIs (Alpaca / Interactive Brokers).
- Complex Three.js 3D visualizations for order-book density.
- Real NLP sentiment analysis pipeline using local LLMs.
