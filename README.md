# Cybersecurity Vulnerability Dashboard

## Quick Start

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Add MongoDB URI
npm start

# Frontend (new terminal)
cd cybersec-vuln-dashboard
npm install
npm run dev
```

Access at `http://localhost:5173`

## Stack

**Backend**: Express.js + MongoDB + node-cache
**Frontend**: React 18 + TypeScript + Redux Toolkit + Material-UI

## Features

- Real-time vulnerability metrics with 30-min caching
- Advanced filtering (severity, status, package, CVE, Kai analysis)
- Sortable paginated table with regex search
- Interactive charts (severity, risk factors, timeline)
- Critical vulnerability alerts
- Mobile responsive design

## Project Structure

```
cybersec-vuln-dashboard/
├── backend/                 # Express REST API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middleware/     # Cache, logging
│   └── README.md
│
└── cybersec-vuln-dashboard/ # React frontend
    ├── src/
    │   ├── components/
    │   ├── store/          # Redux
    │   ├── services/       # API client
    │   └── views/
    └── README.md
```

## Configuration

### Backend `.env`
```env
PORT=5001
MONGODB_URI=mongodb+srv://...
LOG_LEVEL=INFO
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5001/api
```

## API Endpoints

**Dashboard**
- `GET /api/dashboard/aggregates` - Unified data (cached)
- `GET /api/dashboard/cache/stats` - Cache metrics

**Vulnerabilities**
- `GET /api/vulnerabilities` - List with filters/pagination
- `GET /api/vulnerabilities/:id` - Details

## Development

```bash
# Backend with auto-reload
cd backend && npm run dev

# Frontend with HMR
cd cybersec-vuln-dashboard && npm run dev

# Debug mode
LOG_LEVEL=DEBUG npm start
```

## Deployment

**Backend**
```bash
NODE_ENV=production npm start
# Or: pm2 start src/server.js
```

**Frontend**
```bash
npm run build  # Outputs to dist/
```

## Performance

- Unified dashboard endpoint (3→1 requests)
- 95%+ DB load reduction via caching
- Cache warming on startup
- Optimized MongoDB aggregations
- Memoized React components

## Git Workflow

Commits use day-based prefixes:
- `day5:` - Advanced filtering features
- `day6:` - Dashboard caching & optimization

