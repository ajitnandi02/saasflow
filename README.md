# SaaSFlow 🚀

A full-stack Multi-Tenant SaaS Application built with the MERN stack.

SaaSFlow is designed to manage organizations, users, projects, and tasks with secure authentication, role-based access control, and tenant-level data isolation.

---

## 📌 Overview

SaaSFlow is a Multi-Tenant SaaS platform where multiple organizations can use the same application while keeping their data completely isolated from other organizations.

Each organization has its own:

- Users
- Projects
- Tasks
- Dashboard statistics

The application implements authentication, authorization, role-based permissions, and tenant isolation at the backend level.

---

## ✨ Features

### 🔐 Authentication

- User Registration
- User Login
- JWT-based Authentication
- Password Hashing with bcrypt
- Protected Routes
- Automatic Authentication Handling
- Logout functionality

### 🏢 Multi-Tenancy

- Multiple organizations supported
- Organization-based data isolation
- Users belong to a specific organization
- Projects are organization-specific
- Tasks are organization-specific
- Cross-tenant data access is prevented

### 👥 Role-Based Access Control

SaaSFlow supports three roles:

| Role | Permissions |
|------|-------------|
| Owner | Full organization management |
| Admin | Manage users, projects and tasks |
| Member | View organization data |

Role-based restrictions are implemented on both frontend and backend.

### 👤 User Management

- View organization users
- Create users
- Update users
- Delete users
- Role management
- Owner protection
- Email validation
- Password validation

### 📁 Project Management

- Create projects
- View projects
- Update projects
- Delete projects
- Project status management
- Organization-level project isolation

### ✅ Task Management

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Assign tasks to users
- Assign tasks to projects
- Task status management
- Task priority management
- Due date support

### 📊 Dashboard

The dashboard provides organization-level statistics including:

- Total Users
- Total Projects
- Total Tasks
- Tasks by Status
- Tasks by Priority
- Organization information

### 🛡️ Security

- JWT authentication
- Password hashing
- Tenant middleware
- Role middleware
- Protected API routes
- Organization-level database filtering
- Input validation
- Centralized error handling
- Unauthorized access protection

### 📱 Responsive UI

- Desktop-friendly interface
- Mobile responsive layout
- Mobile navigation menu
- Responsive dashboard
- Responsive management pages

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      Client         │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌─────────────────────┐
                    │      Server         │
                    │ Node.js + Express   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Authentication     Tenant Layer      RBAC Layer
          JWT/Bcrypt       Organization       Roles
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │      Database       │
                    └─────────────────────┘