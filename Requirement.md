You are building a **multi-tenant Invoice & Quotation Management System** for **Techverin Pvt. Ltd.**  
This system allows multiple companies to register, get approved, and manage invoices and quotations under their own profile.  
Stack, data models, flows, and rules are below. Build a production-ready full-stack app.

---

### 🧱 TECH STACK
- Frontend: React 18 + Ant Design v5 + React Router + React Query (or SWR)
- Backend: Node.js 20 + Express + TypeScript + Prisma ORM + Zod validation
- Database: PostgreSQL (UUID PKs, tenant-based row scoping)
- Auth: JWT (email/password login, email verification, password reset)
- Styling: Ant Design tokens, responsive layout, print-friendly A4 PDFs
- PDF Generation: Puppeteer or @react-pdf/renderer
- Email: SMTP (HTML templates + plain fallback)
- For image uploads use imagekit.io
- IMAGEKIT_PUBLIC_KEY="public_PX3eDdQWFnIxtXW1UDZog1UnZ8A="
- IMAGEKIT_PRIVATE_KEY="private_AmnbOX3SVy6s0ubqr5yi2zBHmRk="
- IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-imagekit-id"
- Infra: Docker Compose (API + DB), `.env` config, seed demo data

---

### 🏢 MULTI-TENANT STRUCTURE
- Each **company** is an isolated tenant identified by `company_id`.
- A **platform admin** manages company approvals and plan upgrades.
- Companies register via `/register`, pending admin approval.

#### Plans
| Plan | Description | Behavior |
|------|--------------|-----------|
| Starter (default) | Free tier | Invoice/Quotation PDFs include **“Powered by Techverin”** footer |
| Pro | Paid/approved plan | Branding removed; full features |

---

### 🧾 CORE MODULES
#### Company Profile
Editable by company admin or finance role:
- Company name  
- Logo (file upload)  
- Address  
- Contact number, email, website  
- Social media links (Facebook, Instagram, LinkedIn, X/Twitter)  
- GST-TIN number  
- Default currency  
- Bank account list  
- Default invoice/quotation terms  
- Header and footer notes for both invoice and quotation

**Usage:**  
All invoices and quotations automatically load header/footer info from this profile.  
Starter plan always adds “Powered by Techverin” in the footer.

---

### 📊 DATABASE SCHEMA (PostgreSQL + Prisma)
**users**
- id, company_id FK, name, email, password_hash, role ['admin','finance','sales','viewer'], is_active, timestamps

**companies**
- id, name, logo_url, email, phone, address JSON, website, gst_tin_number, default_currency_code, social_links JSON, bank_accounts JSON[], status ['pending','approved','suspended'], plan ['starter','pro'], header/footer notes, terms, timestamps, approved_by FK

**platform_admins**
- id, name, email, password_hash, role ['super_admin','support'], timestamps

**customers, products, quotations, quotation_items, invoices, invoice_items, payments, audit_logs, sequences**
- All include `company_id` for tenant isolation.

---

### 🔄 WORKFLOWS
#### Platform Admin
- Approve/reject/suspend company registrations  
- Change plan (Starter ↔ Pro)  
- View company stats and usage metrics  

#### Company Tenant
1. Register company → Wait for approval  
2. Once approved → Login and setup company profile  
3. Create and send quotations/invoices  
4. Quotation → Convert to Invoice (currency locked)  
5. Record payments, view reports

#### Invoice Flow
Login → Create New Invoice → Select/Create Customer → Select Currency → Add Line Items → Select Terms → Preview & Send.  
If from Quotation → inherit currency & terms.

#### Quotation Flow
Same as invoice flow, with “Convert to Invoice” option.

---

### 🧩 UI / UX (Ant Design v5)
- **Tenant Dashboard** sidebar:
  Dashboard | Quotations | Invoices | Customers | Products & Services | Payments | Reports | Company Profile | Audit Log
- **Platform Admin Dashboard** sidebar:
  Companies | Approvals | Plans | Analytics | Admin Users
- PDF Preview Drawer: shows print layout before send  
- Starter plan shows footer: `Powered by Techverin`

---

### 🧮 BUSINESS LOGIC
- Each company can only access its own data (company_id scope).  
- Platform admins can view all companies.  
- Quotation → Invoice keeps currency fixed.  
- Validation: require company_name, GST/TIN, at least 1 line item, positive totals.  
- Invoice number pattern: `INV-00057-25` (configurable prefix/suffix per tenant).  
- Currency formatting with code prefix (e.g., “US$ 1,234.56”).

---

### 📧 EMAIL TEMPLATES
- Quotation sent  
- Quotation accepted/rejected  
- Invoice sent  
- Payment received  
- Overdue reminder  
- Company approval / plan upgrade notice  

Each email includes a PDF and a secure public link.

---

### 📄 PDF GENERATION
- Header: Company logo, name, contact, GST/TIN  
- Body: Customer info, project ref, issue/due dates, line items, totals  
- Footer: Company footer note + “Powered by Techverin” (Starter only)  
- Design must match or exceed attached sample (professional, A4 layout)  [oai_citation:0‡INV-00057- DJ Balance.pdf](sediment://file_000000008e8c71fa83e241c07a4839e2)

---

### 🔐 SECURITY
- JWT includes company_id + user role  
- All queries filtered by company_id (tenant isolation)  
- Argon2/bcrypt for password hashing  
- Zod for request validation  
- Role-based middleware for access control  
- Audit log for every create/update/delete/send action

---

### ⚙️ API ROUTES
**Public**
- `POST /api/register-company`
- `POST /api/auth/login`
- `POST /api/auth/verify-email`

**Platform Admin**
- `GET /api/admin/companies`
- `PATCH /api/admin/companies/:id/approve`
- `PATCH /api/admin/companies/:id/plan`
- `PATCH /api/admin/companies/:id/status`

**Tenant**
- `GET/PUT /api/company-profile`
- CRUD `/api/quotations`, `/api/invoices`, `/api/customers`, `/api/products`, `/api/payments`
- `GET /api/reports` (aging, sales, tax)
- `GET /api/pdf/:id` for download

---

### 🧠 TESTING
- Unit: totals, plan footer, validation  
- Integration: multi-tenant isolation  
- E2E: register → approve → login → create quotation → convert → send invoice → record payment  

---

### 🚀 DELIVERABLES
- Dockerized app (API + DB + Admin + Tenant UI)
- Seed: 1 platform admin, 1 approved Pro company, 1 pending Starter company
- Sample PDFs for Starter (with branding) and Pro (without branding)
- README with setup + admin credentials

---

### 🎯 GOAL
Deliver a scalable **SaaS-style Invoice & Quotation Platform** where:
- Multiple companies can register and manage their documents
- Techverin acts as the platform owner
- Starter plans show “Powered by Techverin”
- Pro plans remove branding and unlock full access

The app must be **ready to deploy and extend later** for subscription billing (e.g., Stripe).


⸻

