# Hisaabu - Multi-tenant Invoice & Quotation Management System

A production-ready, scalable SaaS platform for managing invoices and quotations across multiple companies/tenants.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Ant Design v5 + Vite
- **Backend**: Node.js 20 + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL 15
- **Auth**: JWT (email/password login, email verification, password reset)
- **Storage**: ImageKit for image uploads
- **Email**: SMTP (HTML templates)
- **PDF**: Puppeteer or @react-pdf/renderer
- **Infrastructure**: Docker Compose for easy deployment

## Project Structure

```
hisaabu/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── server.ts       # Main Express server
│   │   ├── db/             # Database utilities
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React SPA
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service clients
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # State management (Zustand)
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml      # Local development Docker setup
├── example.env            # Environment variables template
├── .gitignore
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js v20+ (tested with v20.19.3)
- PostgreSQL 15+ (tested with v14.17)
- npm v10+

### Setup

#### 1. **Environment Variables**

Copy the example environment file to backend:

```bash
cp example.env backend/.env
```

Verify DATABASE_URL points to your PostgreSQL instance:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hisaabu?schema=public"
```

#### 2. **Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:5000`

**Available endpoints:**
- `GET /health` - Health check
- `GET /health/db` - Database connection check
- `GET /api/version` - API version info

#### 3. **Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Database Management

#### Prisma Studio (Visual DB Browser)

```bash
cd backend
npm run prisma:studio
```

Opens Prisma Studio at `http://localhost:5555`

#### Seed Database (When Ready)

```bash
cd backend
npm run prisma:seed
```

## Development Phases

### Phase 1: Foundation ✅ (COMPLETE)
- [x] Project structure
- [x] Database schema (Prisma + PostgreSQL)
- [x] Express server with middleware
- [x] Health check endpoints
- [x] Database migrations
- [x] Frontend scaffold with React Router + Ant Design

### Phase 2: Basic Authentication (Next)
- [ ] Platform admin login
- [ ] Company registration
- [ ] Company login
- [ ] Email verification

### Phase 3: Company Profile
- [ ] View company profile
- [ ] Update company profile
- [ ] Logo upload (ImageKit)

### Phase 4: Core Entities
- [ ] Customers CRUD
- [ ] Products CRUD

### Phase 5: Quotations
- [ ] Create quotation
- [ ] View quotations
- [ ] PDF generation
- [ ] Email sending

### Phase 6: Invoices
- [ ] Create invoice
- [ ] Convert quotation to invoice
- [ ] View invoices
- [ ] PDF generation

### Phase 7: Payments
- [ ] Record payment
- [ ] View payments
- [ ] Update invoice balance

### Phase 8: Reports
- [ ] Sales report
- [ ] Aging report
- [ ] Tax report

### Phase 9: Platform Admin
- [ ] View companies
- [ ] Approve companies
- [ ] Manage plans

## Database Schema

### Core Models

**PlatformAdmin**
- Manages company approvals and plan upgrades
- Role: super_admin, support

**Company** (Tenant)
- Multi-tenant isolation via company_id
- Plans: starter (with "Powered by Techverin" branding), pro
- Status: pending, approved, suspended

**User**
- Company users with roles: admin, finance, sales, viewer
- Email verification & password reset support

**Customers, Products**
- Core business entities per company
- Support for tax rates and pricing

**Quotations & Invoices**
- Rich document templates with header/footer
- Support for converting quotations to invoices
- Currency locking when converting
- Denormalized amounts for performance

**Payments**
- Track payments against invoices
- Support multiple payment methods
- Update invoice balance amounts

**AuditLog**
- Complete audit trail for compliance
- Tracks CREATE, UPDATE, DELETE, SEND, DOWNLOAD, VIEW actions

**Sequence**
- Auto-increment counters for document numbers
- Customizable prefixes/suffixes per company

## API Architecture

### Authentication
- JWT tokens in Authorization header
- Includes company_id and user role
- Refresh token strategy (to be implemented)

### Multi-tenancy
- All queries filtered by company_id from JWT token
- Prevents cross-tenant data access
- Role-based access control per endpoint

### Validation
- Zod for request validation
- Type-safe request/response handling
- Automatic error responses

### Error Handling
- Structured error responses with status codes
- Detailed error messages in development mode
- Audit logging of errors

## Features Overview

### For Companies
- Register and manage company profile
- Customize invoices/quotations with branding
- Create and manage customers
- Define products & services
- Generate quotations
- Convert quotations to invoices
- Record payments
- Generate reports (sales, aging, tax)
- View audit logs

### For Platform Admin
- Approve/reject company registrations
- Manage company plans (Starter ↔ Pro)
- View company usage metrics
- Manage platform users

## PDF Generation

Invoices and quotations support:
- Company header with logo, name, contact info, GST/TIN
- Customer information
- Project reference and issue/due dates
- Itemized line items with quantities and taxes
- Professional formatting for A4 printing
- Starter plan: "Powered by Techverin" footer branding
- Pro plan: Custom footers without branding

## Email Notifications

### Supported Email Templates
- Quotation sent
- Quotation accepted/rejected
- Invoice sent
- Payment received
- Overdue reminder
- Company approval notice
- Plan upgrade notice

Each email includes:
- Secure public download link to PDF
- HTML and plain text versions
- Company branding

## Security

- JWT-based authentication
- Bcrypt/Argon2 password hashing
- Zod request validation
- Role-based access control (RBAC)
- Tenant isolation at database level
- Audit logging for compliance
- CORS protection
- Helmet.js security headers
- SQL injection prevention (Prisma ORM)

## Development Commands

### Backend

```bash
cd backend

npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database with test data
```

### Frontend

```bash
cd frontend

npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Docker Setup (Optional)

For containerized development:

```bash
# Start PostgreSQL container
docker-compose up -d db

# Backend and frontend still run locally for hot reload
cd backend && npm run dev
cd frontend && npm run dev
```

## Testing

### Unit Tests
- Totals calculations
- Plan-based footer logic
- Input validation

### Integration Tests
- Multi-tenant isolation
- Authentication flows
- Document creation workflows

### E2E Tests
- Register → Approve → Login → Create Quotation → Convert → Send Invoice → Record Payment

## Performance Optimizations

- Denormalized amounts in documents for quick queries
- Database indexes on foreign keys and frequently filtered columns
- Prisma query optimization
- React Query for efficient caching
- Lazy loading of components
- Code splitting with Vite

## Deployment

### Requirements
- Node.js v20+
- PostgreSQL 15+
- Environment variables configured

### Build for Production

```bash
# Backend
cd backend
npm run build
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
# Serve dist/ folder with your web server
```

### Docker Deployment (Future)
- Uncomment services in docker-compose.yml when ready
- Add Dockerfile for API and frontend services
- Use environment variables for configuration

## Future Enhancements

- [ ] Subscription billing (Stripe integration)
- [ ] Payment gateway integration (Razorpay, Stripe)
- [ ] Advanced reporting with exports
- [ ] Recurring invoices/quotations
- [ ] Inventory management
- [ ] Multi-currency support with exchange rates
- [ ] Two-factor authentication
- [ ] API for third-party integrations
- [ ] Mobile app
- [ ] Automated reminders via SMS
- [ ] CRM features
- [ ] Expense tracking

## Support

For issues and feature requests, please refer to the development plan and requirements documentation.

## License

Proprietary - Techverin Pvt. Ltd.

---

**Status**: Phase 1 - Foundation Complete ✅

Next Phase: Basic Authentication
