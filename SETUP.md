# Setup Guide

## Quick Start

1. **Install PostgreSQL** (if not already installed)
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create the database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE innovaite;
   
   # Exit psql
   \q
   ```

3. **Create `.env` file** in the root directory:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=innovaite
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   PORT=3001
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start the application:**
   ```bash
   # Option 1: Run both frontend and backend together
   npm run dev:all
   
   # Option 2: Run separately (in two terminals)
   # Terminal 1:
   npm run dev:server
   
   # Terminal 2:
   npm run dev
   ```

6. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api/health

## Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Verify your database credentials in `.env`
- Check that the database `innovaite` exists

### Port Already in Use
- Change `PORT` in `.env` to a different port (e.g., 3002)
- Or stop the process using the port

### TypeScript Errors
- Run `npm install` again to ensure all types are installed
- Check that `@types/node`, `@types/express`, `@types/pg` are installed

## Database Schema

The database schema is automatically created when you start the server. Tables:
- `users` - User accounts
- `hazards` - Environmental hazard reports

