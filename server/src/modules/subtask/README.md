# 📝 Subtask API Module

## 📖 Overview

The **Subtask Module** allows users to break large tasks into smaller actionable items.

This module is part of the **Student Productivity Automation System** and helps students track progress efficiently by completing tasks step-by-step.

### Example

```text
Task: Build Authentication System

Subtasks:
✓ Create User Table
✓ Register API
□ Login API
□ JWT Middleware
```

---

# 🗄️ Database Schema

## Subtasks Table

```sql
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,

    completed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW()
);
```

---

# 🔗 Relationship

```text
User
│
└── Subject
      │
      └── Task
            │
            └── Subtasks
```

### Example

```text
Task
│
├── Create User Table
├── Register API
├── Login API
└── JWT Middleware
```

---

# 🚀 Features

* Create Subtask
* Get All Subtasks By Task
* Update Subtask
* Delete Subtask
* Mark Subtask Complete
* Mark Subtask Incomplete
* Automatic Task Progress Calculation
* Automatic Parent Task Completion

---

# 📡 API Endpoints

## Create Subtask

### Endpoint

```http
POST /api/subtasks/task/:taskId
```

### Request Body

```json
{
  "title": "Create User Table"
}
```

### Response

```json
{
  "success": true,
  "subtask": {
    "id": "uuid",
    "task_id": "task_uuid",
    "title": "Create User Table",
    "completed": false
  }
}
```

---

## Get All Subtasks

### Endpoint

```http
GET /api/subtasks/task/:taskId
```

### Response

```json
{
  "success": true,
  "subtasks": [
    {
      "id": "uuid",
      "title": "Create User Table",
      "completed": false
    }
  ]
}
```

---

## Update Subtask

### Endpoint

```http
PUT /api/subtasks/:id
```

### Request Body

```json
{
  "title": "Create Users Table"
}
```

### Response

```json
{
  "success": true,
  "updatedSubtask": {
    "id": "uuid",
    "title": "Create Users Table"
  }
}
```

---

## Toggle Completion Status

### Endpoint

```http
PATCH /api/subtasks/:id
```

### Request Body

```json
{
  "completed": true
}
```

### Response

```json
{
  "success": true,
  "subtask": {
    "id": "uuid",
    "completed": true
  },
  "progress": {
    "total": 4,
    "completed": 1,
    "progress": 25
  }
}
```

---

## Delete Subtask

### Endpoint

```http
DELETE /api/subtasks/:id
```

### Response

```json
{
  "success": true,
  "message": "Subtask deleted successfully"
}
```

---

# 📊 Task Progress Calculation

The module automatically calculates task progress using completed subtasks.

### Formula

```text
Progress (%) =
(Completed Subtasks / Total Subtasks) × 100
```

### Example

```text
Total Subtasks      = 5
Completed Subtasks  = 3

Progress = 60%
```

---

# 🤖 Auto Complete Parent Task

When all subtasks are completed:

```text
Completed Subtasks = Total Subtasks
```

The parent task is automatically updated.

### Before

```json
{
  "status": "in_progress"
}
```

### After

```json
{
  "status": "completed",
  "completed_at": "2026-06-22T10:00:00Z"
}
```

---

# 📂 Folder Structure

```text
src/
│
├── modules
│   │
│   └── subtask
│       │
│       ├── controller
│       │   └── subtask.controller.js
│       │
│       ├── router
│       │   └── subtask.routes.js
│       │
│       ├── utils
│       │   └── taskProgress.js
│       │
│       └── index.js
│
├── middleware
├── config
└── utils
```

---

# 🔄 Module Workflow

```text
Create Task
      │
      ▼
Create Subtasks
      │
      ▼
Complete Subtasks
      │
      ▼
Calculate Progress
      │
      ▼
100% Progress?
      │
 ┌────┴────┐
 │         │
 No       Yes
 │         │
 ▼         ▼
Keep      Auto Complete
Working   Parent Task
```

---

# 🎯 Learning Outcomes

By building this module, you learn:

* PostgreSQL Relationships
* Foreign Keys
* REST API Design
* CRUD Operations
* Business Logic Implementation
* Progress Tracking Systems
* Task Automation
* Backend Architecture
* Express.js Controllers & Routes

---

# ✅ Module Status

```text
✓ Create Subtask
✓ Get Subtasks
✓ Update Subtask
✓ Delete Subtask
✓ Toggle Completion
✓ Progress Calculation
✓ Auto Complete Task
```

The Subtask Module is now fully functional and integrated with the Task Management System.