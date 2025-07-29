# CSSECDV Secure Task Management System

This is a secure web application built as a final case study for the CSSECDV (Secure Web Development) course. It follows best practices in authentication, authorization, validation, and secure error handling.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL

## 🔧 Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `/server`:
   ```
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database>?schema=public"
   JWT_SECRET=supersecret
   PORT=5050
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. (Optional) Seed default users:
   ```bash
   npx prisma db seed
    ```
   This will create:
	•	"admin@admin.com" with password "Admin123!" as ADMIN
	•	"manager@manager.com" with password "Manager123!" as MANAGER
	•	"employee@employee.com" with password "Employee123!" as EMPLOYEE

6. Start the backend server:
   ```bash
   npm run dev
   ```

## 💻 Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm run dev
   ```

4. Visit the app at:
   ```
   http://localhost:3000
   ```

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (ADMIN, MANAGER, EMPLOYEE)
- Password complexity, length, and reuse prevention
- Password minimum age requirement (1 day)
- Account lockout after 5 failed login attempts
- Secure password reset with 15-minute token expiry
- Full audit logging of sensitive events (login, role changes, etc.)
- Logs only visible to ADMIN users
- Input validation on both frontend and backend
- Generic error messages to prevent information leakage
- Admin-only user creation with validation and role restrictions

## 👥 User Roles and Access

| Role      | Permissions                                                       |
|-----------|-------------------------------------------------------------------|
| ADMIN     | Manage all users, assign roles, and view full audit logs          |
| MANAGER   | Manage EMPLOYEE users and tasks within their scope                |
| EMPLOYEE  | Register, login, and manage only their own tasks/data             |

## 🧪 Useful Commands

### Backend

```bash
npm run dev             # Start backend server
npx prisma migrate dev  # Apply DB migrations
npx prisma generate     # Generate Prisma client
npx prisma db seed      # Seed initial users (ADMIN, MANAGER, EMPLOYEE)
```

### Frontend

```bash
npm run dev             # Start frontend server
```

## 📦 Folder Structure (Simplified)

- `/client` – React frontend
- `/server` – Node.js/Express backend
  - `controllers/` – Business logic (auth, users, tasks)
  - `routes/` – API endpoints
  - `middlewares/` – Auth and role-based access control
  - `prisma/` – Prisma schema and migration files
  - `utils/` – Audit logger and validation helpers
  - `.env` – Environment variables (JWT, DB, port)

## 📝 Notes

- Client runs on `http://localhost:3000`
- Server runs on `http://localhost:5050`
- Admin-only audit log access: `GET /api/admin/audit-logs`
- Admin-only user creation: `POST /api/admin/create-user`

## 📄 License

For educational use only – De La Salle University, CSSECDV.