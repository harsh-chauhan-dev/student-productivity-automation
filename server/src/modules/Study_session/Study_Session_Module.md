# ⏱️ Study Session Module

The Study Session Module enables students to track focused study time for a specific subject and task. It ensures that only one study session can be active at a time and automatically calculates the study duration when the session ends.

This module is the foundation for productivity analytics and time-tracking features.

---

# Overview

A study session represents a focused period where a student studies a particular task under a subject.

Example

```text id="r5wz9q"
Subject

Database Management System

↓

Task

Normalization

↓

Study Session

Start: 7:00 PM

End: 8:30 PM

Duration: 90 Minutes
```

---

# Features

* Start Study Session
* End Study Session
* Automatic Duration Calculation
* Prevent Multiple Active Sessions
* Subject Validation
* Task Validation
* Get All Sessions
* Get Session By ID
* Delete Session
* User Data Isolation

---

# Module Architecture

```text id="qel0kl"
Client

│

▼

Authentication Middleware

│

▼

Study Session Controller

│

├──────────────┐

▼              ▼

Validate      Validate

Subject        Task

│              │

└──────┬───────┘

       ▼

Create Session

       │

       ▼

End Session

       │

       ▼

Calculate Duration

       │

       ▼

Store in PostgreSQL
```

---

# Folder Structure

```text id="mjlwm9"
src/
├── controllers/
│      studySession.controller.js
│
├── routes/
│      studySession.routes.js
│
├── middleware/
│      auth.middleware.js
│
└── config/
       db_config.js
```

---

# Database Schema

## study_sessions

| Column           | Type      | Description          |
| ---------------- | --------- | -------------------- |
| id               | UUID      | Primary Key          |
| user_id          | UUID      | Session Owner        |
| subject_id       | UUID      | Subject              |
| task_id          | UUID      | Task                 |
| started_at       | TIMESTAMP | Session Start        |
| ended_at         | TIMESTAMP | Session End          |
| duration_minutes | INTEGER   | Total Study Duration |
| created_at       | TIMESTAMP | Created Time         |

---

# Authentication

All APIs require a valid JWT Access Token.

Authenticated user

```javascript id="6r2e6d"
req.user.id
```

---

# API Endpoints

| Method | Endpoint                    | Description         |
| ------ | --------------------------- | ------------------- |
| POST   | /api/study-sessions/start   | Start Study Session |
| PATCH  | /api/study-sessions/:id/end | End Study Session   |
| GET    | /api/study-sessions         | Get All Sessions    |
| GET    | /api/study-sessions/:id     | Get Session By ID   |
| DELETE | /api/study-sessions/:id     | Delete Session      |

---

# Start Study Session

## Request

```http id="yx22ns"
POST /api/study-sessions/start
```

### Request Body

```json id="vcyf61"
{
    "subject_id":"subject_uuid",
    "task_id":"task_uuid"
}
```

### Success Response

```json id="lxf7mr"
{
    "success":true,
    "session":{}
}
```

---

# End Study Session

## Request

```http id="8pnklw"
PATCH /api/study-sessions/:id/end
```

### Success Response

```json id="wnt4dt"
{
    "success":true,
    "session":{
        "duration_minutes":95
    }
}
```

---

# Get All Sessions

## Request

```http id="v0ewwk"
GET /api/study-sessions
```

### Success Response

```json id="k6s8xh"
{
    "success":true,
    "count":5,
    "sessions":[]
}
```

---

# Get Session By ID

## Request

```http id="uh1hho"
GET /api/study-sessions/:id
```

### Success Response

```json id="j5x5v0"
{
    "success":true,
    "session":{}
}
```

---

# Delete Session

## Request

```http id="mkkmp9"
DELETE /api/study-sessions/:id
```

### Success Response

```json id="2fxtyn"
{
    "success":true,
    "message":"Session deleted successfully"
}
```

---

# Business Logic

## Start Session

```text id="mr7l4m"
Receive Request

↓

Validate Subject

↓

Validate Task

↓

Check Active Session

↓

Create Session

↓

Return Session
```

---

## End Session

```text id="ooc2uu"
Receive Session ID

↓

Find Session

↓

Already Ended?

│

├── Yes → Return Error

│

└── No

↓

Calculate Duration

↓

Update ended_at

↓

Save Duration

↓

Return Session
```

---

# Active Session Validation

The system allows only one active study session per user.

Logic

```text id="g4jlwm"
User

↓

Search

ended_at IS NULL

↓

Exists?

│

├── Yes

│      Return Error

│

└── No

↓

Create New Session
```

---

# Duration Calculation

Study duration is calculated automatically.

```javascript id="yxmquz"
duration =
End Time
-
Start Time
```

Example

```text id="7v6a9u"
Started

7:00 PM

Ended

8:45 PM

↓

Duration

105 Minutes
```

---

# Validation Rules

Before creating a session

* Subject must exist
* Subject must belong to the current user
* Task must belong to the selected subject
* User must not already have an active study session

---

# Relationship

```text id="9pmpem"
User

│

▼

Subject

│

▼

Task

│

▼

Study Session
```

---

# Test Cases

## Start Session

### ✅ Valid Request

```json id="cm0v6l"
{
    "subject_id":"valid_uuid",
    "task_id":"valid_uuid"
}
```

Expected

```text id="e3lpxk"
201 Created
```

---

### ❌ Missing Subject

Expected

```text id="kqbyr8"
400 Subject ID and Task ID are required
```

---

### ❌ Missing Task

Expected

```text id="1u1lgu"
400 Subject ID and Task ID are required
```

---

### ❌ Invalid Subject

Expected

```text id="efpjh5"
404 Subject not found
```

---

### ❌ Task Doesn't Belong to Subject

Expected

```text id="j1e36t"
404 Task does not belong to selected subject
```

---

### ❌ Active Session Exists

Expected

```text id="rzjlwm"
400 You already have an active study session
```

---

# End Session

### ✅ Valid Session

Expected

```text id="uyaz6z"
200 OK

Duration Calculated
```

---

### ❌ Session Already Ended

Expected

```text id="vjlwm6"
400 Session already ended
```

---

### ❌ Invalid Session ID

Expected

```text id="jjlwm7"
404 Session not found
```

---

# Get All Sessions

### ✅ Existing Sessions

Expected

```text id="njlwm8"
200 OK
```

---

### ✅ No Sessions

Expected

```json id="jlwm90"
{
    "success":true,
    "count":0,
    "sessions":[]
}
```

---

# Delete Session

### ✅ Existing Session

Expected

```text id="jlwm91"
200 Session deleted successfully
```

---

### ❌ Invalid Session

Expected

```text id="jlwm92"
404 Session not found
```

---

# Error Responses

| Status | Description             |
| ------ | ----------------------- |
| 400    | Missing Required Fields |
| 400    | Active Session Exists   |
| 400    | Session Already Ended   |
| 401    | Unauthorized            |
| 404    | Subject Not Found       |
| 404    | Task Not Found          |
| 404    | Session Not Found       |
| 500    | Internal Server Error   |

---

# API Usage Flow

```text id="jlwm93"
Register

↓

Login

↓

Create Subject

↓

Create Task

↓

Start Study Session

↓

Study

↓

End Study Session

↓

Duration Calculated

↓

Analytics Module
```

---

# Future Improvements

* Pause/Resume Session
* Pomodoro Timer
* Live Study Timer
* Session Notes
* Session Tags
* Auto Stop After Inactivity
* Daily Study Goals
* Weekly Reports
* Monthly Analytics
* Session Export (CSV/PDF)
* Calendar Integration

---

# Module Summary

* ✅ JWT Protected APIs
* ✅ Complete CRUD Operations
* ✅ One Active Session Per User
* ✅ Automatic Study Duration Calculation
* ✅ Subject & Task Validation
* ✅ User Data Isolation
* ✅ PostgreSQL Integration
* ✅ Foundation for Analytics Dashboard

The Study Session Module provides accurate study time tracking and acts as the primary data source for productivity analytics, weekly reports, and future performance insights.