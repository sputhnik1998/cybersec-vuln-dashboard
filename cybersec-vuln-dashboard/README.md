# Frontend - Cybersecurity Vulnerability Dashboard

React + TypeScript frontend for vulnerability tracking and analysis.

## Tech Stack

- **React 18** + **TypeScript**
- **Redux Toolkit** - State management
- **Material-UI** - UI components
- **Recharts** - Data visualization
- **Vite** - Build tool with HMR
- **React Router** - Navigation

## Setup

```bash
npm install
npm run dev
```

Access at `http://localhost:5173`

## Configuration

Create `.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # ESLint
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── alerts/      # Alert components
│   ├── cards/       # Metric/Severity cards
│   ├── charts/      # Chart components (Recharts)
│   ├── layout/      # Layout wrapper
│   └── tables/      # Vulnerability table
├── services/        # API client (axios)
├── store/           # Redux slices
│   ├── dashboardSlice.ts
│   └── vulnerabilitiesSlice.ts
├── types/           # TypeScript interfaces
├── utils/           # Utilities
└── views/           # Page components
    ├── dashboard/   # Dashboard page
    └── cve-detail/  # CVE detail page
```

## Features

### Dashboard
- Real-time metrics with automatic caching
- Severity distribution radial chart
- Risk factors bar chart
- Vulnerabilities timeline (current page)
- Critical vulnerability alerts

### Vulnerability Table
- Advanced filtering (severity, status, package, CVE)
- Kai analysis exclusion toggles
- Column sorting
- Pagination with max jump protection
- Regex search support
- Click-through to CVE details

### Mobile Responsive
- Adaptive grid layouts
- Optimized chart sizing
- Touch-friendly interactions

## State Management

Redux slices handle:
- **Dashboard**: Stats, risk factors, timeline caching
- **Vulnerabilities**: Pagination, filters, sorting, scroll position

## Build & Deploy

```bash
npm run build
# Outputs to dist/
# Serve with nginx, Vercel, etc.
```

## Development Notes

- Uses CSS variables for theming (dark mode)
- Memoized components for performance
- Type-safe with strict TypeScript
- Centralized type definitions in `/src/types`
