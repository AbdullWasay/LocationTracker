# Location Tracker Web Application

A simple web application that captures user location and IP address data when users click on a shared link. Perfect for educational purposes and understanding geolocation APIs.

## Features

- 📍 **Location Tracking**: Captures GPS coordinates when users allow location access
- 🌐 **IP Address Logging**: Records visitor IP addresses automatically
- 📱 **Mobile & Desktop Compatible**: Works seamlessly on all devices
- 🔒 **Privacy Aware**: Handles location permission gracefully (works even if denied)
- 📊 **Admin Dashboard**: View all collected data in a beautiful interface
- 📥 **Data Export**: Export collected data as CSV
- 🎨 **Modern UI**: Beautiful, responsive design

## How It Works

1. **Share the Link**: Send `http://your-domain.com/track` to anyone via WhatsApp, Telegram, etc.
2. **User Clicks**: When they click, the page loads and automatically requests location
3. **Data Capture**: Whether they allow or deny location, basic data is still captured:
   - IP address
   - Country/City (from IP)
   - User agent (browser/device info)
   - Timestamp
   - GPS coordinates (if permission granted)
4. **View Results**: Check the admin dashboard to see all collected data

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 3. Access the Application
- **Tracking Page**: http://localhost:3000/track
- **Admin Dashboard**: http://localhost:3000/admin
- **API Info**: http://localhost:3000

## Project Structure

```
checkproject/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── location_data.db       # SQLite database (created automatically)
├── public/
│   ├── track.html         # Tracking page (what users see)
│   └── admin.html         # Admin dashboard
└── README.md             # This file
```

## API Endpoints

- `GET /track` - Tracking page for users
- `GET /admin` - Admin dashboard
- `POST /api/capture` - Capture location data
- `GET /api/data` - Retrieve all captured data

## Database Schema

The SQLite database stores the following information:

| Field | Type | Description |
|-------|------|-------------|
| id | TEXT | Unique visit ID |
| ip_address | TEXT | Visitor's IP address |
| user_agent | TEXT | Browser/device information |
| latitude | REAL | GPS latitude (if granted) |
| longitude | REAL | GPS longitude (if granted) |
| accuracy | REAL | GPS accuracy in meters |
| location_permission | TEXT | granted/denied/not_supported |
| timestamp | DATETIME | When the visit occurred |
| country | TEXT | Country from IP lookup |
| city | TEXT | City from IP lookup |
| referrer | TEXT | Referring website |

## Deployment Options

### Option 1: Heroku
1. Create a Heroku app
2. Push your code to Heroku
3. The app will automatically start

### Option 2: VPS/Cloud Server
1. Upload files to your server
2. Install Node.js and npm
3. Run `npm install` and `npm start`
4. Use PM2 for process management: `pm2 start server.js`

### Option 3: Local Network
- Perfect for testing within your local network
- Access via your computer's IP address

## Security Considerations

⚠️ **Important**: This application is designed for educational purposes. For production use, consider:

- Adding authentication to the admin dashboard
- Implementing rate limiting
- Adding HTTPS/SSL certificates
- Validating and sanitizing all inputs
- Adding GDPR compliance features
- Implementing data retention policies

## Legal & Ethical Use

- Always inform users about data collection
- Comply with local privacy laws (GDPR, CCPA, etc.)
- Use only for legitimate educational or research purposes
- Respect user privacy and data protection rights

## Troubleshooting

### Server Won't Start
- Check if port 3000 is available
- Ensure all dependencies are installed: `npm install`

### Location Not Working
- HTTPS is required for geolocation in production
- Some browsers block location on localhost

### Database Issues
- The SQLite database file is created automatically
- Check file permissions if you get database errors

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is for educational purposes. Use responsibly and in compliance with applicable laws.
