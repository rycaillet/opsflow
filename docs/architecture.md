# OpsFlow System Architecture

## Architecture Style

OpsFlow follows a modern three-tier architecture.

Frontend
↓
REST API
↓
Backend
↓
PostgreSQL Database

The frontend never communicates directly with the database.

All data flows through the backend API.

---

## Frontend

Technology:

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS

Responsibilities:

- User interface
- Forms
- Routing
- Authentication state
- API communication

---

## Backend

Technology:

- Node.js
- Express
- TypeScript

Responsibilities:

- Business logic
- Authentication
- Authorization
- Validation
- Database access
- REST API

---

## Database

Technology:

- PostgreSQL
- Prisma ORM

Responsibilities:

- Store users
- Store requests
- Store comments
- Store future analytics data

---

## Communication

Frontend
↓

HTTPS Request

↓

Express API

↓

Prisma

↓

PostgreSQL

↓

JSON Response

↓

Frontend UI

---

## Authentication

JWT stored inside secure HTTP-only cookies.

Protected routes require authentication.

Role-based authorization controls access to administrative features.

---

## Design Principles

- Separation of concerns
- Reusable components
- Single responsibility principle
- RESTful API design
- Type safety with TypeScript
- Mobile-first responsive design

## Repository Strategy

OpsFlow will use a monorepo structure.

The frontend, backend, and documentation will live inside one GitHub repository.

### Structure

```txt
opsflow/
├── frontend/
├── backend/
└── docs/