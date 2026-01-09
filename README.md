# Innovaite - Environmental Hazard Map

A collaborative platform where users can tag environmental hazards on a map, claim them, and mark them as completed.

## Features

- 🗺️ Interactive map with OpenStreetMap tiles
- 📍 Tag environmental hazards by clicking on the map
- 👥 User authentication and management
- ✅ Claim hazards to work on them
- ✨ Mark hazards as completed
- 🎨 Color-coded markers (blue = open, yellow = claimed, green = completed)

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite
- React-Leaflet for map functionality
- Leaflet for map rendering

### Backend
- Node.js with Express
- PostgreSQL database
- TypeScript

## Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database:
```bash
# Create a database named 'innovaite'
createdb innovaite
```

3. Configure environment variables:
Create a `.env` file in the root directory:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=innovaite
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3001
```

4. Start the development servers:

Option 1: Run both frontend and backend together:
```bash
npm run dev:all
```

Option 2: Run separately:
```bash
# Terminal 1 - Backend server
npm run dev:server

# Terminal 2 - Frontend
npm run dev
```

5. Open your browser:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR, UNIQUE)
- `email` (VARCHAR, UNIQUE)
- `created_at` (TIMESTAMP)

### Hazards Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, REFERENCES users)
- `lat` (DECIMAL) - Latitude
- `lng` (DECIMAL) - Longitude
- `description` (TEXT)
- `status` (VARCHAR) - 'open', 'claimed', or 'completed'
- `claimed_by` (INTEGER, REFERENCES users)
- `completed_by` (INTEGER, REFERENCES users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## API Endpoints

### Hazards
- `GET /api/hazards` - Get all hazards
- `GET /api/hazards/:id` - Get a specific hazard
- `POST /api/hazards` - Create a new hazard
- `PATCH /api/hazards/:id/claim` - Claim a hazard
- `PATCH /api/hazards/:id/complete` - Mark a hazard as completed
- `DELETE /api/hazards/:id` - Delete a hazard

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user

## Usage

1. **Create an account**: Enter a username and email to create your account
2. **View hazards**: All existing hazards are displayed on the map with color-coded markers
3. **Report a hazard**: Click anywhere on the map to report a new environmental hazard
4. **Claim a hazard**: Click on an open (blue) hazard marker and click "Claim" to take responsibility
5. **Complete a hazard**: After claiming a hazard, click "Mark Complete" when you've finished addressing it

## Development

- Frontend code: `src/`
- Backend code: `server/`
- Database migrations: Run automatically on server start

## License

MIT
