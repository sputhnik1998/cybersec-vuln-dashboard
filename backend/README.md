# Cybersecurity Vulnerability Dashboard

Production-ready dashboard for tracking and analyzing security vulnerabilities with advanced filtering, caching, and real-time statistics.

## Architecture

- **Backend**: Express.js REST API with MongoDB and node-cache
- **Frontend**: React + TypeScript + Redux Toolkit + Material-UI
- **Caching**: 30-minute TTL, 95%+ DB load reduction
- **Performance**: Unified dashboard endpoint, optimized aggregations

## Features

### Dashboard
- Real-time vulnerability metrics with caching
- Severity breakdown radial charts
- Top 10 risk factors visualization
- 12-month vulnerability timeline
- Critical alerts for high-risk vulnerabilities

### Vulnerability Table
- Advanced filtering (severity, status, package, CVE, Kai analysis)
- Sortable columns with pagination
- Search with regex support
- Exclusion filters for analysis results
- Export and detailed CVE views

### Performance
- Single unified API endpoint for dashboard (3→1 requests)
- Automatic cache warming on server startup
- Cache hit rate monitoring
- Debug logging system (ERROR/WARN/INFO/DEBUG)

## Quick Start

```bash
# Clone repository
git clone <repo-url>
cd cybersec-vuln-dashboard

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI
npm start

# Frontend setup (new terminal)
cd ../cybersec-vuln-dashboard
npm install
npm run dev
```

Access dashboard at `http://localhost:5173`

## Configuration

### Backend (.env)
```env
PORT=5001
MONGODB_URI=mongodb+srv://...
LOG_LEVEL=INFO  # ERROR | WARN | INFO | DEBUG
```

### Frontend
```env
VITE_API_URL=http://localhost:5001/api
```

## API Documentation

### Dashboard Endpoints
- `GET /api/dashboard/aggregates` - Unified dashboard data (cached)
- `GET /api/dashboard/cache/stats` - Cache metrics
- `POST /api/dashboard/cache/invalidate` - Invalidate cache

### Vulnerability Endpoints
- `GET /api/vulnerabilities` - List with filters, pagination, sorting
- `GET /api/vulnerabilities/:id` - Single vulnerability details

## Development

```bash
# Backend (with nodemon)
cd backend && npm run dev

# Frontend (with Vite HMR)
cd cybersec-vuln-dashboard && npm run dev

# Debug mode
LOG_LEVEL=DEBUG npm start
```

## Project Structure

```
cybersec-vuln-dashboard/
├── backend/                 # Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Cache, logging
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Logger, utilities
│   └── README.md          # Backend docs
│
├── cybersec-vuln-dashboard/ # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API client
│   │   └── views/         # Pages
│   └── README.md          # Frontend docs
│
└── README.md              # This file
```

## Deployment

### Backend
```bash
NODE_ENV=production LOG_LEVEL=INFO npm start

# Or with PM2
pm2 start src/server.js --name cybersec-api
```

### Frontend
```bash
npm run build
# Serve dist/ folder with nginx or similar
```

## Git Workflow

Recent commits follow day-based agile workflow:
- `day5`: Advanced table filtering components
- `day6`: Dashboard optimization with caching

## License

MIT
