# Quick Setup Guide - Cybersecurity Vulnerability Dashboard

## Backend Setup (5 minutes)

### Step 1: Choose Your MongoDB Option

#### Option A: MongoDB Atlas (Cloud - Free & Easiest)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (FREE M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

#### Option B: Local MongoDB (If you prefer local)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Step 2: Configure Backend

```bash
cd backend

# Edit .env file and add your MongoDB connection string
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/cybersec-dashboard
# For Local: mongodb://localhost:27017/cybersec-dashboard
```

### Step 3: Import Your Data

```bash
# Place your vulnerabilities JSON file somewhere
# Then run:
npm run import /path/to/your/vulnerabilities.json

# Example:
# npm run import ~/Downloads/vulnerabilities.json
```

### Step 4: Start Backend Server

```bash
npm run dev
```

Backend will run on: http://localhost:5000

Test it: http://localhost:5000/health

## Frontend Setup (2 minutes)

```bash
cd ../cybersec-vuln-dashboard

# Install axios for API calls
npm install axios

# Start frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## API Endpoints Available

- `GET /api/vulnerabilities` - Get all vulnerabilities (with filters)
- `GET /api/vulnerabilities/stats` - Dashboard statistics
- `GET /api/vulnerabilities/timeline` - Vulnerabilities over time
- `GET /api/vulnerabilities/risk-factors` - Risk factor analysis

### Example API Call

```javascript
// Get dashboard stats
fetch('http://localhost:5000/api/vulnerabilities/stats')
  .then(res => res.json())
  .then(data => console.log(data));

// Get critical vulnerabilities
fetch('http://localhost:5000/api/vulnerabilities?severity=critical&limit=10')
  .then(res => res.json())
  .then(data => console.log(data));
```

## Next Steps

1. Connect React frontend to backend API
2. Replace hardcoded data in Header component with real API data
3. Add charts for visualization (Recharts/Chart.js)
4. Add vulnerability table with pagination

## Troubleshooting

**MongoDB Connection Error:**
- Check your `.env` file has correct MONGODB_URI
- For Atlas: Ensure your IP is whitelisted (or allow all: 0.0.0.0/0)
- For Atlas: Check username/password are correct

**Port Already in Use:**
- Change PORT in `.env` to 5001 or another available port

**Import Taking Too Long:**
- Normal for 700k records (may take 5-10 minutes)
- Progress will be shown in console
