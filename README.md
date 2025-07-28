# CSSECDV Secure Task Management System

This is a secure web application built as a final case study for the CSSECDV (Secure Web Development) course. It follows best practices in authentication, authorization, validation, and secure error handling.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL

---

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
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. (Optional) Seed default users:
   ```bash
   npx prisma db seed
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

---

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

---

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (ADMIN, MANAGER, CUSTOMER)
- Password complexity, length, and reuse prevention
- Password minimum age requirement (1 day)
- Account lockout after 5 failed attempts
- Secure password reset with 15-minute token expiry
- Full audit logging of sensitive events
- Logs only visible to ADMIN users
- Input validation on frontend and backend
- Generic error responses to avoid leaking system info

---

## 👥 User Roles and Access

| Role      | Permissions                                                       |
|-----------|-------------------------------------------------------------------|
| ADMIN     | Manage all users, assign roles, and view full audit logs          |
| MANAGER   | Manage Role B users and tasks within their scope                  |
| CUSTOMER  | Register, login, and manage only their own tasks/data             |

---

## 🧪 Useful Commands

### Backend

```bash
npm run dev             # Start backend server
npx prisma migrate dev  # Apply DB migrations
npx prisma generate     # Generate Prisma client
npx prisma db seed      # Seed initial users (ADMIN, MANAGER, CUSTOMER)
```

### Frontend

```bash
npm run dev             # Start frontend server
```

---

## 📦 Folder Structure (Simplified)

- `/client` – React frontend
- `/server` – Node.js/Express backend
  - `controllers/` – Business logic
  - `routes/` – API routes
  - `middlewares/` – Auth + role protection
  - `prisma/` – Schema and migrations
  - `utils/` – Logging helper
  - `.env` – Environment config

---

## 📝 Notes

- Client runs on `http://localhost:3000`
- Server runs on `http://localhost:5050`
- Audit logs viewable at `/admin-only` (admin auth required)

---

## 📄 License

For educational use only – De La Salle University, CSSECDV.