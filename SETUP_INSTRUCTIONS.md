# Hisaabu - Setup Instructions

Complete setup guide for running the Hisaabu multi-tenant invoice & quotation management system.

## Prerequisites

✅ Verified on your system:
- Node.js v20.19.3 ✓
- npm v10.8.2 ✓
- PostgreSQL 14.17 ✓ (database "hisaabu" already created)
- Docker v28.5.1 ✓

## Quick Start (5 minutes)

### 1. Start Backend Server

```bash
cd /Users/ahmedsalam/dev/hisaabu/backend
npm run dev
```

Expected output:
```
✓ Database connected successfully
✓ Server running on http://localhost:5000
✓ Environment: development
✓ Health check: http://localhost:5000/health
✓ DB Health check: http://localhost:5000/health/db
```

### 2. Start Frontend (New Terminal)

```bash
cd /Users/ahmedsalam/dev/hisaabu/frontend
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

### 3. Verify Setup

Open in browser or use curl:

```bash
# Backend health check
curl http://localhost:5000/health

# Database connectivity check
curl http://localhost:5000/health/db

# Frontend
open http://localhost:3000
```

---

## Detailed Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Database configuration**
   - File: `backend/.env`
   - Should contain:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hisaabu?schema=public"
   PORT=5000
   NODE_ENV=development
   ```

4. **Database setup** (already completed)
   ```bash
   npm run prisma:migrate      # Apply migrations
   npm run prisma:generate     # Generate Prisma Client
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Available npm scripts**
   ```bash
   npm run dev                 # Start with hot reload
   npm run build              # Build for production
   npm run start              # Run production build
   npm run prisma:generate    # Regenerate Prisma Client
   npm run prisma:migrate     # Run migrations
   npm run prisma:studio      # Open Prisma Studio (GUI)
   npm run prisma:seed        # Seed database (when ready)
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Available npm scripts**
   ```bash
   npm run dev        # Start dev server on :3000
   npm run build      # Build for production
   npm run preview    # Preview production build
   npm run lint       # Run ESLint
   ```

---

## API Endpoints (Phase 1)

### Health Checks
- `GET /health` - Basic server health
- `GET /health/db` - Database connectivity
- `GET /api/version` - API version info

Example responses:

```bash
$ curl http://localhost:5000/health
{
  "status": "ok",
  "timestamp": "2025-11-06T10:30:00.000Z",
  "uptime": 120.5
}

$ curl http://localhost:5000/health/db
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-11-06T10:30:00.000Z"
}

$ curl http://localhost:5000/api/version
{
  "version": "1.0.0",
  "name": "Hisaabu Backend",
  "environment": "development"
}
```

---

## Database Management

### Prisma Studio (Visual Database Browser)

```bash
cd backend
npm run prisma:studio
```

Opens interactive database GUI at `http://localhost:5555`

Features:
- View/edit all database tables
- Create/update/delete records
- Filter and search
- Visual relationship explorer

### PostgreSQL Direct Access

```bash
# Connect to database via psql
psql postgresql://postgres:postgres@localhost:5432/hisaabu

# List tables
\dt

# View users table
SELECT * FROM users;

# Disconnect
\q
```

### Database Seeding (When Ready)

```bash
cd backend
npm run prisma:seed
```

Will populate test data for:
- Platform admin account
- Approved Pro company
- Pending Starter company

---

## Development Workflow

### Making Changes

1. **Backend Code Changes**
   - Edit files in `backend/src/`
   - Server auto-reloads with nodemon
   - No need to restart

2. **Frontend Code Changes**
   - Edit files in `frontend/src/`
   - Vite hot-reloads automatically
   - Changes appear instantly in browser

3. **Database Schema Changes**
   ```bash
   cd backend

   # Edit backend/prisma/schema.prisma

   # Create and run migration
   npm run prisma:migrate -- --name describe_your_change

   # Regenerate Prisma Client
   npm run prisma:generate
   ```

4. **Dependencies**
   ```bash
   # Add new dependency
   npm install package-name

   # Update package-lock
   npm update

   # Check for vulnerabilities
   npm audit
   ```

---

## Docker Setup (Optional)

For containerized PostgreSQL (if not using local):

```bash
# Start PostgreSQL container
docker-compose up -d db

# Check status
docker-compose ps

# View logs
docker-compose logs db

# Stop container
docker-compose down
```

---

## Troubleshooting

### Issue: "Database connection failed"

**Solution:**
```bash
# 1. Verify PostgreSQL is running
psql --version

# 2. Test connection
psql postgresql://postgres:postgres@localhost:5432/hisaabu -c "SELECT 1"

# 3. If using Docker
docker-compose up -d db
docker-compose logs db
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port (edit backend/.env)
PORT=5001 npm run dev
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port (edit vite.config.ts)
npm run dev -- --port 3001
```

### Issue: "Module not found errors"

**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

# Or for frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Prisma Client out of date"

**Solution:**
```bash
cd backend
npm run prisma:generate
```

---

## File Structure

```
hisaabu/
├── backend/
│   ├── src/
│   │   └── server.ts                # Main Express server
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── migrations/              # Migration files
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                         # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                  # Main React component
│   │   └── main.tsx                 # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml               # Docker configuration
├── example.env                      # Env template
├── README.md                        # Full documentation
├── DEVELOPMENT_PLAN.md              # Development roadmap
├── PHASE1_COMPLETION.md             # Phase 1 summary
└── SETUP_INSTRUCTIONS.md            # This file
```

---

## Environment Variables

### Backend (.env)

```
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hisaabu?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT (Set in Phase 2)
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# SMTP Email (Set in Phase 3)
SMTP_HOST=smtp.brevo.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@techverin.com

# ImageKit (Set in Phase 3)
IMAGEKIT_PUBLIC_KEY=public_PX3eDdQWFnIxtXW1UDZog1UnZ8A=
IMAGEKIT_PRIVATE_KEY=private_AmnbOX3SVy6s0ubqr5yi2zBHmRk=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## Next Steps

### Phase 2: Authentication (Ready to Start)

1. Create login API endpoint
2. Implement JWT token generation
3. Add password hashing
4. Create registration flow
5. Add role-based middleware

**Estimated Time**: 6-8 hours

### Resources
- [PHASE1_COMPLETION.md](PHASE1_COMPLETION.md) - Detailed Phase 1 status
- [README.md](README.md) - Complete documentation
- [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) - Full roadmap

---

## Support

For issues:
1. Check the troubleshooting section above
2. Review logs in browser console (frontend)
3. Check terminal output (backend)
4. Review Prisma Studio for data issues

---

**Status**: Phase 1 Complete ✅ - Ready for Phase 2: Authentication

Built with ❤️ following gradual development principles
