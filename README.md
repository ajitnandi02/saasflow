# SaaSFlow 🚀

A production-oriented Multi-Tenant SaaS Application built with the MERN Stack.

SaaSFlow allows multiple organizations (tenants) to securely use the same application while keeping their users, projects, and tasks isolated from other organizations.

---

## 📌 Project Overview

SaaSFlow is a full-stack Multi-Tenant SaaS application designed to demonstrate real-world SaaS architecture, authentication, authorization, tenant isolation, role-based access control, and organization-level data management.

Each organization has its own users, projects, and tasks, while the backend ensures that data from one organization cannot be accessed by another organization.

---

## ✨ Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing with bcrypt
- Protected Routes
- Automatic Authentication Handling

### 🏢 Multi-Tenancy

- Organization-based architecture
- Tenant identification through authenticated users
- Organization-level data isolation
- Secure tenant-scoped database queries

### 👥 Role-Based Access Control

SaaSFlow supports three roles:

- **Owner**
- **Admin**
- **Member**

#### Owner

- Full organization access
- Create, update and delete users
- Create, update and delete projects
- Create, update and delete tasks

#### Admin

- Manage users
- Create and update projects
- Create and update tasks
- Restricted from owner-level actions

#### Member

- View organization data
- View users
- View projects
- View tasks
- Cannot perform management operations

### 👤 User Management

- Create users
- View users
- Update users
- Delete users
- Role management
- Owner protection
- Organization-scoped users

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
- Due dates

### 📊 Dashboard

- Total users
- Total projects
- Total tasks
- Tasks by status
- Tasks by priority
- Organization information
- Responsive dashboard

### 🛡️ Security

- JWT-based authentication
- Password hashing
- Role-based authorization
- Tenant middleware
- Tenant-scoped queries
- Centralized error handling
- Input validation
- Duplicate data handling
- Unauthorized request protection

### 📱 Responsive UI

- Desktop layout
- Tablet-friendly layout
- Mobile navigation
- Responsive dashboard
- Responsive management pages

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ Node.js + Express   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          Authentication   Tenant/RBAC    Controllers
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │    MongoDB Atlas    │
                    └─────────────────────┘