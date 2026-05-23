# 🚼 DevPulse

> Internal Tech Issue & Feature Tracker
>
> _A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions. An internal issue and feature tracker_

---

## 3️⃣ Quick Access

```
✅ GitHub Repo (Public):      https://github.com/ashfaqshuvo007/DevPulse
✅ Live Deployment (Public):  https://devpulse-api-one.vercel.app
```

---

## 🛠️ Technology Stack

| Technology   | Note                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| Node.js      | LTS runtime (24.x or higher)                                                  |
| TypeScript   | use latest version, dont use beta version                                     |
| Express.js   | Modular router architecture                                                   |
| PostgreSQL   | Relational database, native `pg` driver only                                  |
| Raw SQL      | Direct `pool.query()` calls, absolutely no query builders, ORMs, or SQL JOINs |
| bcrypt       | Password hashing, salt rounds between 8 and 12                                |
| jsonwebtoken | JWT generation & verification (standard tokens)                               |

---

## 📚 Project Structure

```
src
 ┣ config
 ┃ ┗ index.ts
 ┣ db
 ┃ ┗ index.ts
 ┣ middleware
 ┃ ┣ auth.ts
 ┃ ┣ globalErrorHandler.ts
 ┃ ┗ index.d.ts
 ┣ modules
 ┃ ┣ auth
 ┃ ┃ ┣ auth.controller.ts
 ┃ ┃ ┣ auth.interface.ts
 ┃ ┃ ┣ auth.route.ts
 ┃ ┃ ┗ auth.service.ts
 ┃ ┗ issue
 ┃ ┃ ┣ issue.controller.ts
 ┃ ┃ ┣ issue.interface.ts
 ┃ ┃ ┣ issue.route.ts
 ┃ ┃ ┗ issue.service.ts
 ┣ types
 ┃ ┗ index.ts
 ┣ utils
 ┃ ┣ IssueHelpers.ts
 ┃ ┣ encrypt.ts
 ┃ ┗ sendResponse.ts
 ┣ app.ts
 ┗ server.ts
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd DevPulse
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
API_VERSION=v1
BASE_URL=api

DB_URL=<neon-db-connection-string>

JWT_SECRET=<generate-randomly-from-web>

REFRESH_SECRET=<generate-randomly-from-web>

```

### 3. Install dependencies

```bash
npm install
```

### 3. Run the project

```bash
npm run dev
```

The API will be available at `http://localhost:<Your-PORT-FROM-ENV>/api/`

---

## 👥 Features

| User Role       | Allowed Actions                                                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **contributor** | • Register and log in<br>• Create new issues (bug or feature request)<br>• View all issues                                                                          |
| **maintainer**  | • All contributor permissions<br>• Update any issue field<br>• Delete any issue<br>• Change issue workflow status independently<br>• Access internal system metrics |

---

## 🗄️ Database Schema

### Table 1: `users`

| Field        | Requirement (Plain Text)                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------- |
| `id`         | Auto-incrementing unique identifier for each account                                                |
| `name`       | Full display name of the team member, must be provided                                              |
| `email`      | Valid login address, must be unique across all accounts, must be provided                           |
| `password`   | Encrypted string stored securely, must be provided during registration, never returned in responses |
| `role`       | Determines system access level, defaults to `contributor`, must be `contributor` or `maintainer`    |
| `created_at` | Timestamp marking when the account was created, automatically generated on insert                   |
| `updated_at` | Timestamp marking when the account was last updated, automatically refreshed on update              |

### Table 2: `issues`

| Field         | Requirement (Plain Text)                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| `id`          | Auto-incrementing unique identifier for each reported item                                                      |
| `title`       | Short descriptive headline, must be provided, maximum 150 characters                                            |
| `description` | Detailed explanation of the problem or suggestion, must be provided, minimum 20 characters                      |
| `type`        | Categorizes the entry, must be either `bug` or `feature_request`                                                |
| `status`      | Current workflow state, defaults to `open`. Status must be one of: `open`, `in_progress`, `resolved`            |
| `reporter_id` | References the user who submitted the issue (no foreign key constraint required; validate in application logic) |
| `created_at`  | Timestamp marking when the issue was created, automatically generated on insert                                 |
| `updated_at`  | Timestamp marking when the issue was last updated, automatically refreshed on update                            |

---

## 🌐 API Endpoints Specification

### 🔹 Authentication Module

### 1. User Registration

**Access:** Public

**Description:** Register a new user account with contributor or maintainer role

**Endpoint**

`POST /api/auth/signup`

**Request Body**

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

**Success Response (201 Created)**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@devpulse.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

---

### 2. User Login

**Access:** Public

**Description:** Authenticate user and receive JWT token

**Endpoint**

`POST /api/auth/login`

**Request Body**

```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@devpulse.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00Z",
      "updated_at": "2026-01-20T09:00:00Z"
    }
  }
}
```

---

### 🔹 Issues Module

### 3. Create Issue

**Access:** Authenticated users (`contributor`, `maintainer`)

**Description:** Create a new bug report or feature request

**Endpoint**

`POST /api/issues`

**Headers**

```
Authorization: <JWT_TOKEN>
```

**Request Body**

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

**Success Response (201 Created)**

```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

---

### 4. Get All Issues

**Access:** Public

**Description:** Retrieve all issues with optional sorting and filtering

**Endpoint**

`GET /api/issues?sort=newest`

**Query Parameters**

| Param    | Values                            | Default  |
| -------- | --------------------------------- | -------- |
| `sort`   | `newest`, `oldest`                | `newest` |
| `type`   | `bug`, `feature_request`          | (none)   |
| `status` | `open`, `in_progress`, `resolved` | (none)   |

**Success Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": 45,
      "title": "Database connection timeout under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-01-20T10:30:00Z",
      "updated_at": "2026-01-20T14:45:00Z"
    }
  ]
}
```

---

### 5. Get Single Issue

**Access:** Public

**Description:** Retrieve full details of a specific issue

**Endpoint**

`GET /api/issues/:id`

**Success Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    },
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T14:45:00Z"
  }
}
```

---

### 6. Update Issue

**Access:** Maintainer (any issue) OR Contributor (own issue, only if status is `open`)

**Description:** Update issue title, description, or type

**Endpoint**

`PATCH /api/issues/:id`

**Headers**

```
Authorization: <JWT_TOKEN>
```

**Request Body**

```json
{
  "title": "Updated: Database pool exhaustion fix needed",
  "description": "Updated description with reproduction steps...",
  "type": "bug"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Issue updated successfully",
  "data": {
    "id": 45,
    "title": "Updated: Database pool exhaustion fix needed",
    "description": "Updated description with reproduction steps...",
    "type": "bug",
    "status": "in_progress",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T14:45:00Z"
  }
}
```

---

### 7. Delete Issue

**Access:** Maintainer only

**Description:** Permanently remove an issue from the system

**Endpoint**

`DELETE /api/issues/:id`

**Headers**

```
Authorization: <JWT_TOKEN>
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

---
