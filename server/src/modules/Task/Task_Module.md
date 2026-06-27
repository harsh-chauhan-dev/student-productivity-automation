# ✅ Task Management Module

The Task Management Module is the core of the Student Productivity Automation system. It allows authenticated users to create, organize, update, and track academic tasks under their subjects.

Every task belongs to exactly one subject and one authenticated user.

---

# Overview

Tasks help students manage assignments, homework, projects, exams, and study goals.

Each task includes:

* Title
* Description
* Priority
* Status
* Due Date
* Estimated Study Time
* Subject

Example

```text
Harsh
│
├── DBMS
│      ├── Learn SQL Joins
│      ├── Normalize Database
│      └── ER Diagram
│
├── Operating System
│      ├── Deadlock Assignment
│      └── CPU Scheduling
│
└── Computer Networks
       ├── TCP/IP Notes
       └── Socket Programming
```

---

# Features

* Create Task
* View All Tasks
* Get Task By ID
* Update Task
* Delete Task
* Assign Task to Subject
* Priority Management
* Status Management
* Due Date Tracking
* Estimated Study Time
* User Data Isolation

---

# Module Architecture

```text
Client

│

▼

Authentication Middleware

│

▼

Task Controller

│

▼

Subject Validation

│

▼

PostgreSQL

│

▼

JSON Response
```

---

# Folder Structure

```text
src/
├── controllers/
│      task.controller.js
│
├── routes/
│      task.routes.js
│
├── middleware/
│      auth.middleware.js
│
└── config/
       db_config.js
```

---

# Database Schema

## tasks

| Column            | Type      | Description                       |
| ----------------- | --------- | --------------------------------- |
| id                | UUID      | Primary Key                       |
| user_id           | UUID      | Task Owner                        |
| subject_id        | UUID      | Parent Subject                    |
| title             | VARCHAR   | Task Title                        |
| description       | TEXT      | Task Description                  |
| priority          | ENUM      | low / medium / high               |
| status            | ENUM      | pending / in_progress / completed |
| due_date          | TIMESTAMP | Due Date                          |
| estimated_minutes | INTEGER   | Estimated Duration                |
| created_at        | TIMESTAMP | Created Time                      |
| updated_at        | TIMESTAMP | Last Updated                      |

---

# Authentication

All Task APIs require authentication.

```text
JWT Access Token
```

Current user is extracted from

```javascript
req.user.id
```

---

# API Endpoints

| Method | Endpoint       | Description    |
| ------ | -------------- | -------------- |
| POST   | /api/tasks     | Create Task    |
| GET    | /api/tasks     | Get All Tasks  |
| GET    | /api/tasks/:id | Get Task By ID |
| PUT    | /api/tasks/:id | Update Task    |
| DELETE | /api/tasks/:id | Delete Task    |

---

# Create Task

## Request

```http
POST /api/tasks
```

### Request Body

```json
{
    "title":"Learn SQL Joins",
    "description":"Practice INNER JOIN and LEFT JOIN",
    "priority":"high",
    "status":"pending",
    "due_date":"2026-06-30",
    "estimated_minutes":120,
    "subject_id":"subject_uuid"
}
```

### Success Response

```json
{
    "success":true,
    "message":"Task create successfull",
    "task":{}
}
```

---

# Get All Tasks

## Request

```http
GET /api/tasks
```

### Success Response

```json
{
    "success":true,
    "count":3,
    "task":[]
}
```

Each task also contains

```text
subject_name
```

using SQL JOIN.

---

# Get Task By ID

## Request

```http
GET /api/tasks/:id
```

### Success Response

```json
{
    "success":true,
    "task":{}
}
```

---

# Update Task

## Request

```http
PUT /api/tasks/:id
```

### Request Body

```json
{
    "title":"Learn Advanced SQL",
    "priority":"medium",
    "status":"in_progress",
    "estimated_minutes":180,
    "subject_id":"subject_uuid"
}
```

### Success Response

```json
{
    "success":true,
    "message":"Task updated successfully",
    "task":{}
}
```

---

# Delete Task

## Request

```http
DELETE /api/tasks/:id
```

### Success Response

```json
{
    "success":true,
    "message":"Task deleted successfully"
}
```

---

# Business Logic

## Create Task

```text
Receive Request

↓

Validate Required Fields

↓

Verify Subject Ownership

↓

Insert Task

↓

Return Created Task
```

---

## Get Tasks

```text
Authenticated User

↓

Fetch Tasks

↓

JOIN Subject Table

↓

Return Task List
```

---

## Update Task

```text
Receive Task ID

↓

Verify Subject Exists

↓

Verify Task Ownership

↓

Update Task

↓

Return Updated Task
```

---

## Delete Task

```text
Receive Task ID

↓

Verify Ownership

↓

Delete Task

↓

Return Success
```

---

# Relationships

```text
User

│

└──────────────┐

               ▼

          Subjects

               │

               ▼

             Tasks
```

Every task belongs to:

* One User
* One Subject

---

# Security

Every database query filters using

```sql
user_id = req.user.id
```

This prevents users from viewing or modifying other users' tasks.

---

# Task Status

Supported values

```text
pending

in_progress

completed
```

---

# Task Priority

Supported values

```text
low

medium

high
```

Default Priority

```text
medium
```

Default Status

```text
pending
```

---

# Test Cases

## Create Task

### ✅ Valid Task

```json
{
    "title":"Learn SQL",
    "subject_id":"valid_subject_uuid"
}
```

Expected

```text
201 Created
```

---

### ❌ Missing Title

```json
{
    "subject_id":"uuid"
}
```

Expected

```text
401 Title and Subject are required
```

---

### ❌ Missing Subject

```json
{
    "title":"Learn SQL"
}
```

Expected

```text
401 Title and Subject are required
```

---

### ❌ Invalid Subject

Use a subject ID that doesn't exist.

Expected

```text
404 Subject not found
```

---

### ❌ Unauthorized User

No JWT.

Expected

```text
401 Unauthorized
```

---

# Get All Tasks

### ✅ Existing Tasks

Expected

```text
200 OK
```

---

### ✅ No Tasks

Expected

```json
{
    "success":true,
    "count":0,
    "task":[]
}
```

---

# Get Task By ID

### ✅ Valid Task

Expected

```text
200 OK
```

---

### ❌ Invalid Task ID

Expected

```text
404 Task not found
```

---

### ❌ Access Another User's Task

Expected

```text
404 Task not found
```

---

# Update Task

### ✅ Update Status

```json
{
    "status":"completed"
}
```

Expected

```text
200 OK
```

---

### ✅ Change Subject

Provide another valid subject.

Expected

```text
200 OK
```

---

### ❌ Invalid Subject

Expected

```text
404 Subject not found
```

---

### ❌ Task Doesn't Exist

Expected

```text
404 Task not found
```

---

# Delete Task

### ✅ Existing Task

Expected

```text
200 Task deleted successfully
```

---

### ❌ Already Deleted

Expected

```text
404 Task not found
```

---

# Error Responses

| Status | Description             |
| ------ | ----------------------- |
| 401    | Missing Required Fields |
| 401    | Unauthorized            |
| 404    | Subject Not Found       |
| 404    | Task Not Found          |
| 500    | Internal Server Error   |

---

# API Usage Flow

```text
Register

↓

Login

↓

Create Subject

↓

Create Task

↓

Get All Tasks

↓

Update Task

↓

Delete Task
```

---

# Future Improvements

* Task search
* Task filtering
* Task sorting
* Task pagination
* Task labels/tags
* Task attachments
* Recurring tasks
* Task completion history
* Soft delete
* Bulk update
* Bulk delete
* Task dependencies
* Task comments

---

# Module Summary

* ✅ JWT Protected APIs
* ✅ Complete CRUD Operations
* ✅ Subject Validation
* ✅ User Data Isolation
* ✅ PostgreSQL Integration
* ✅ SQL JOIN for Subject Information
* ✅ Priority & Status Management
* ✅ Due Date Support
* ✅ Estimated Study Time Tracking

The Task Management Module serves as the foundation for Subtasks, Study Sessions, Reminders, Notifications, and Analytics, making it one of the central modules of the Student Productivity Automation backend.