# 📊 Dashboard Analytics Module

The Dashboard Analytics Module provides a centralized overview of a student's academic productivity. It aggregates data from multiple modules—including Subjects, Tasks, and Study Sessions—to generate real-time statistics that power the application's dashboard.

Unlike a standard CRUD module, this module is a **read-only analytics service**. It performs data aggregation and calculations without modifying any database records.

---

# Overview

The Dashboard Analytics Module summarizes a user's academic progress by collecting information from different database tables.

It provides:

* Total Subjects
* Total Tasks
* Completed Tasks
* Pending Tasks
* Total Study Sessions
* Total Study Minutes
* Task Completion Rate

Example Dashboard

```text id="t4xm2c"
Dashboard

Subjects            5

Tasks               18

Completed Tasks     12

Pending Tasks       6

Study Sessions      24

Study Minutes       1420

Completion Rate     66.67%
```

---

# Features

* Dashboard Overview
* Task Statistics
* Subject Statistics
* Study Session Statistics
* Total Study Time
* Completion Percentage
* Parallel Database Queries
* Read-Only Analytics
* Service Layer Architecture

---

# Module Architecture

```text id="r9yk4v"
Client

│

▼

Authentication Middleware

│

▼

Dashboard Controller

│

▼

Dashboard Analytics Service

│

▼

PostgreSQL

│

▼

JSON Response
```

---

# Folder Structure

```text id="m7sq5x"
src/
├── controllers/
│      dashboard.controller.js
│
├── services/
│      dashboardServices.js
│
├── routes/
│      dashboard.routes.js
│
├── middleware/
│      auth.middleware.js
│
└── config/
       db_config.js
```

---

# Authentication

Dashboard APIs require authentication.

Authenticated user

```javascript id="k8fd7n"
req.user.id
```

All statistics are calculated only for the authenticated user.

---

# API Endpoint

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| GET    | `/api/dashboard` | Get Dashboard Analytics |

---

# Get Dashboard Analytics

## Request

```http id="x4eh2m"
GET /api/dashboard
```

### Success Response

```json id="q2lp7f"
{
    "success": true,
    "data": {
        "subjects": 5,
        "tasks": 18,
        "completedTasks": 12,
        "pendingTasks": 6,
        "studySessions": 24,
        "studyMinutes": 1420,
        "completionRate": 66.67
    }
}
```

---

# Business Logic

```text id="e6ht8w"
Receive Request

↓

Authenticate User

↓

Call Analytics Service

↓

Execute Parallel Queries

↓

Calculate Completion Rate

↓

Return Dashboard Statistics
```

---

# Service Workflow

The service executes multiple database queries simultaneously using

```javascript id="d9gj3v"
Promise.all()
```

Workflow

```text id="v2nq6k"
Dashboard Request

│

├───────────────┐

▼               ▼

Tasks         Subjects

│               │

▼               ▼

Completed    Pending

│               │

└──────┬────────┘

       ▼

Study Sessions

       ▼

Study Minutes

       ▼

Calculate Completion %

       ▼

Return Analytics
```

---

# Performance Optimization

Instead of executing database queries one after another

```text id="u5rc9d"
Query 1

↓

Query 2

↓

Query 3

↓

Query 4
```

The module executes them in parallel

```text id="j3px7b"
Query 1

Query 2

Query 3

Query 4

Query 5

Query 6

↓

Promise.all()

↓

Single Response
```

This reduces response time significantly.

---

# Analytics Calculated

## Total Subjects

```sql id="v6lk2r"
SELECT COUNT(*)

FROM subjects

WHERE user_id = ?
```

---

## Total Tasks

```sql id="p8yb4q"
SELECT COUNT(*)

FROM tasks

WHERE user_id = ?
```

---

## Completed Tasks

```sql id="h5tm1e"
SELECT COUNT(*)

FROM tasks

WHERE status = 'completed'
```

---

## Pending Tasks

```sql id="g2wn9m"
SELECT COUNT(*)

FROM tasks

WHERE status = 'pending'
```

---

## Study Sessions

```sql id="b7js6k"
SELECT COUNT(*)

FROM study_sessions
```

---

## Study Minutes

```sql id="n4ez1f"
SELECT COALESCE(SUM(duration_minutes),0)

FROM study_sessions
```

---

# Completion Rate Formula

```text id="z8pa5u"
Completion Rate

=

Completed Tasks

─────────────── × 100

Total Tasks
```

Example

```text id="s4rm8y"
Completed Tasks

8

Total Tasks

10

↓

Completion Rate

80%
```

If no tasks exist

```text id="y1cd4w"
Completion Rate = 0%
```

This avoids division-by-zero errors.

---

# Data Sources

```text id="c5mv8p"
subjects

↓

tasks

↓

study_sessions

↓

Dashboard Analytics
```

---

# Test Cases

## Dashboard With Data

Database

```text id="p2qh6e"
Subjects = 5

Tasks = 20

Completed = 15

Pending = 5

Study Sessions = 18

Study Minutes = 1100
```

Expected

```json id="x8fr2n"
{
    "subjects":5,
    "tasks":20,
    "completedTasks":15,
    "pendingTasks":5,
    "studySessions":18,
    "studyMinutes":1100,
    "completionRate":75
}
```

---

## New User

Database

```text id="r4jk9d"
No Subjects

No Tasks

No Sessions
```

Expected

```json id="u6qy8f"
{
    "subjects":0,
    "tasks":0,
    "completedTasks":0,
    "pendingTasks":0,
    "studySessions":0,
    "studyMinutes":0,
    "completionRate":0
}
```

---

## Unauthorized Request

Expected

```text id="n5wp3h"
401 Unauthorized
```

---

## Database Error

Expected

```text id="a7ls2v"
500 Internal Server Error
```

---

# Error Responses

| Status | Description           |
| ------ | --------------------- |
| 401    | Unauthorized          |
| 500    | Internal Server Error |

---

# API Usage Flow

```text id="h2cv9m"
Login

↓

Open Dashboard

↓

Dashboard Controller

↓

Dashboard Service

↓

Collect Statistics

↓

Calculate Completion Rate

↓

Return Dashboard Data
```

---

# Future Improvements

* Weekly Analytics
* Monthly Analytics
* Subject-wise Analytics
* Daily Study Time
* Productivity Score
* Study Streak
* Charts & Graph Data
* Heatmap Analytics
* Goal Progress Tracking
* Average Study Time
* Most Studied Subject
* Recent Activity Timeline
* Export Analytics (PDF/CSV)

---

# Module Summary

* ✅ JWT Protected API
* ✅ Read-Only Analytics
* ✅ Parallel Database Queries
* ✅ Promise.all() Optimization
* ✅ Task Completion Rate Calculation
* ✅ Study Time Aggregation
* ✅ Service Layer Architecture
* ✅ PostgreSQL Integration
* ✅ Production-Ready Dashboard API

The Dashboard Analytics Module serves as the central reporting engine of the Student Productivity Automation system. By aggregating data from multiple modules into a single optimized response, it enables users to monitor their productivity, measure progress, and gain actionable insights into their academic performance.