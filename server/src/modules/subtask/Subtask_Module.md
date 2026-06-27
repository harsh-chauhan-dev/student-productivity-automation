# ✅ Subtask Management Module

The Subtask Management Module enables users to divide a task into smaller, manageable steps. It also provides automatic task progress tracking and updates the parent task's status based on subtask completion.

Unlike a basic CRUD implementation, this module introduces business logic by synchronizing the parent task with the completion state of its subtasks.

---

# Overview

Every subtask belongs to exactly one task.

Example

```text
Task
│
├── Learn SQL Basics
├── Practice JOIN Queries
├── Normalize Database
└── Solve 20 SQL Problems
```

As the user completes subtasks, the parent task status is automatically updated.

---

# Features

* Create Subtask
* View All Subtasks
* Update Subtask Title
* Toggle Completion Status
* Delete Subtask
* Automatic Task Progress Calculation
* Automatic Parent Task Status Update
* Completion Percentage Tracking

---

# Module Architecture

```text
Client

│

▼

Authentication Middleware

│

▼

Subtask Controller

│

▼

Task Progress Utility

│

▼

Update Parent Task

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
│      subtask.controller.js
│
├── routes/
│      subtask.routes.js
│
├── utils/
│      taskProgress.js
│
└── config/
       db_config.js
```

---

# Database Schema

## subtasks

| Column     | Type      | Description       |
| ---------- | --------- | ----------------- |
| id         | UUID      | Primary Key       |
| task_id    | UUID      | Parent Task       |
| title      | VARCHAR   | Subtask Title     |
| completed  | BOOLEAN   | Completion Status |
| created_at | TIMESTAMP | Created Time      |
| updated_at | TIMESTAMP | Updated Time      |

---

# Relationship

```text
User

│

▼

Subject

│

▼

Task

│

▼

Subtasks
```

One Task can contain multiple Subtasks.

---

# Authentication

All APIs require a valid JWT Access Token.

Current user

```javascript
req.user.id
```

---

# API Endpoints

| Method | Endpoint                    | Description       |
| ------ | --------------------------- | ----------------- |
| POST   | /api/tasks/:taskId/subtasks | Create Subtask    |
| GET    | /api/tasks/:taskId/subtasks | Get All Subtasks  |
| PUT    | /api/subtasks/:id           | Update Subtask    |
| PATCH  | /api/subtasks/:id/toggle    | Toggle Completion |
| DELETE | /api/subtasks/:id           | Delete Subtask    |

---

# Create Subtask

## Request

```http
POST /api/tasks/:taskId/subtasks
```

### Body

```json
{
    "title":"Practice SQL JOIN"
}
```

### Success Response

```json
{
    "success":true,
    "subtask":{}
}
```

---

# Get All Subtasks

## Request

```http
GET /api/tasks/:taskId/subtasks
```

### Success Response

```json
{
    "success":true,
    "subtasks":[]
}
```

Subtasks are returned in ascending creation order.

---

# Update Subtask

## Request

```http
PUT /api/subtasks/:id
```

### Body

```json
{
    "title":"Practice INNER JOIN and LEFT JOIN"
}
```

### Success Response

```json
{
    "success":true,
    "updatedSubtask":{}
}
```

---

# Toggle Completion

## Request

```http
PATCH /api/subtasks/:id/toggle
```

### Body

```json
{
    "completed":true
}
```

### Success Response

```json
{
    "success":true,
    "subtask":{},
    "progress":{
        "total":4,
        "completed":2,
        "percentage":50
    }
}
```

---

# Delete Subtask

## Request

```http
DELETE /api/subtasks/:id
```

### Success Response

```json
{
    "success":true,
    "message":"Subtask deleted successfully"
}
```

---

# Business Logic

## Create Subtask

```text
Receive Request

↓

Validate Task ID

↓

Insert Subtask

↓

Return Created Subtask
```

---

## Toggle Completion

```text
Receive Request

↓

Update completed Status

↓

Calculate Task Progress

↓

Are All Subtasks Completed?

       │

 ┌─────┴─────┐

 │           │

YES          NO

 │           │

 ▼           ▼

Task        Task

Completed   In Progress
```

---

# Automatic Task Progress

The controller calls

```javascript
getTaskProgress(pool, taskId)
```

Example

```text
Task

5 Subtasks

↓

Completed

3

↓

Progress

60%
```

---

# Automatic Parent Task Update

If

```text
Completed Subtasks == Total Subtasks
```

then

```sql
status = completed

completed_at = NOW()
```

Otherwise

```sql
status = in_progress

completed_at = NULL
```

This ensures the parent task always reflects the latest subtask progress.

---

# Progress Example

```text
Task

Learn PostgreSQL

│

├── Install PostgreSQL      ✅

├── Learn SELECT            ✅

├── Learn JOIN              ❌

├── Learn GROUP BY          ❌

Total

4

Completed

2

Progress

50%

Task Status

In Progress
```

After completing the remaining subtasks

```text
Progress

100%

↓

Task Status

Completed
```

---

# Test Cases

## Create Subtask

### ✅ Valid Request

```json
{
    "title":"Practice SQL JOIN"
}
```

Expected

```text
201 Created
```

---

### ❌ Missing Title

```json
{}
```

Expected

```text
400 Task ID and title are required
```

---

### ❌ Invalid Task ID

Expected

```text
404 Task not found
```

---

# Get Subtasks

### ✅ Existing Subtasks

Expected

```text
200 OK
```

---

### ✅ No Subtasks

Expected

```json
{
    "success":true,
    "subtasks":[]
}
```

---

# Update Subtask

### ✅ Valid Update

Expected

```text
200 OK
```

---

### ❌ Invalid Subtask

Expected

```text
404 Subtask not found
```

---

# Toggle Completion

### ✅ Mark Complete

Request

```json
{
    "completed":true
}
```

Expected

* Subtask updated
* Progress recalculated
* Parent task updated if required

---

### ✅ Mark Incomplete

Request

```json
{
    "completed":false
}
```

Expected

* Parent task becomes `in_progress`
* Progress updated

---

### ❌ Invalid Subtask ID

Expected

```text
404 Subtask not found
```

---

# Delete Subtask

### ✅ Existing Subtask

Expected

```text
200 Subtask deleted successfully
```

---

### ❌ Already Deleted

Expected

```text
404 Subtask not found
```

---

# Error Responses

| Status | Description              |
| ------ | ------------------------ |
| 400    | Missing Task ID or Title |
| 401    | Unauthorized             |
| 404    | Task Not Found           |
| 404    | Subtask Not Found        |
| 500    | Internal Server Error    |

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

Create Subtask

↓

Update Subtask

↓

Toggle Completion

↓

Automatically Update Parent Task

↓

Delete Subtask
```

---

# Future Improvements

* Subtask due dates
* Subtask priority
* Reorder subtasks
* Nested subtasks
* Subtask attachments
* Assigned users
* Completion history
* Activity log
* Comments
* Drag-and-drop ordering
* Recurring subtasks

---

# Module Summary

* ✅ Complete CRUD Operations
* ✅ JWT Protected APIs
* ✅ Parent Task Validation
* ✅ Automatic Progress Calculation
* ✅ Automatic Task Status Synchronization
* ✅ PostgreSQL Integration
* ✅ Business Logic Beyond CRUD
* ✅ Real-time Completion Tracking

The Subtask Management Module is one of the core productivity features of the application. By automatically calculating progress and synchronizing the parent task's status, it provides an intelligent task management workflow that goes beyond simple CRUD operations.