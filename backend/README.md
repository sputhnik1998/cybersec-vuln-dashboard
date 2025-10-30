# Cybersecurity Vulnerability Dashboard - Backend

MongoDB + Express.js backend API for managing and querying vulnerability data.

## Setup Instructions

### 1. Install MongoDB

Choose ONE option:

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier - M0)
4. Click "Connect" and get your connection string
5. Update `.env` file with your connection string

#### Option B: MongoDB Local (On your Mac)
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### 2. Configure Environment Variables

Update the `.env` file:

```env
PORT=5000
MONGODB_URI=your-mongodb-connection-string
NODE_ENV=development
```

For local MongoDB, use:
```
MONGODB_URI=mongodb://localhost:27017/cybersec-dashboard
```

For MongoDB Atlas, use the connection string from step 1:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cybersec-dashboard?retryWrites=true&w=majority
```

### 3. Import Your Data

Place your JSON file with vulnerability data in a location, then run:

```bash
npm run import /path/to/your/vulnerabilities.json
```

Example:
```bash
npm run import ../data/vulnerabilities.json
```

This will:
- Connect to MongoDB
- Clear existing data
- Import all records in batches of 1000
- Create indexes for fast querying

### 4. Start the Server

Development mode (auto-restart on changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on: `http://localhost:5000`

## API Endpoints

### Get Vulnerabilities
```
GET /api/vulnerabilities
```

Query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `severity` - Filter by severity (critical, high, medium, low)
- `status` - Filter by status (e.g., "fixed")
- `packageName` - Filter by package name
- `cve` - Search by CVE ID
- `sortBy` - Sort field (default: published)
- `order` - Sort order (asc/desc, default: desc)

Example:
```
GET /api/vulnerabilities?severity=critical&page=1&limit=20
```

### Get Dashboard Statistics
```
GET /api/vulnerabilities/stats
```

Returns:
- Total vulnerabilities
- Affected repositories count
- Fixed percentage
- Severity breakdown

### Get Vulnerabilities Timeline
```
GET /api/vulnerabilities/timeline?months=12
```

Returns vulnerability counts grouped by month.

### Get Risk Factors
```
GET /api/vulnerabilities/risk-factors
```

Returns top 10 risk factors with counts.

### Get Single Vulnerability
```
GET /api/vulnerabilities/:id
```

### Health Check
```
GET /health
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── models/
│   │   └── Vulnerability.js  # Mongoose schema
│   ├── controllers/
│   │   └── vulnerabilityController.js  # Business logic
│   ├── routes/
│   │   └── vulnerabilityRoutes.js      # API routes
│   ├── utils/
│   │   └── importData.js     # Data import script
│   └── server.js             # Express app entry point
├── .env                      # Environment variables
├── .env.example             # Environment template
└── package.json
```

## Quick Start

```bash
# Install dependencies
npm install

# Set up MongoDB (choose Atlas or local)

# Update .env with MongoDB URI

# Import data
npm run import /path/to/vulnerabilities.json

# Start server
npm run dev
```

## Performance Notes

- Indexes are created automatically on:
  - CVE ID
  - Severity
  - Package name
  - Status
  - Fix date
- Optimized for 700k+ records
- Queries use lean() for better performance
- Pagination prevents memory issues
