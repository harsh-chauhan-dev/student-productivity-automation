# ⏰ Reminder Management Module

The Reminder Management Module enables students to schedule reminders for their tasks. It works together with the background Reminder Job, Email Service, and Notification Service to automatically notify users when a task is due.

Unlike a basic CRUD module, this module integrates with background automation to provide real-time reminder functionality.

---

# Overview

A reminder belongs to a task and is triggered automatically at the specified date and time.

Example

```text id="n1u6sp"
Task

Complete DBMS Assignment

↓

Reminder

Tomorrow 6:00 PM

↓

Cron Job

↓

Email Notification

↓

In-App Notification
```

---

# Features

* Create Reminder
* Get All Reminders
* Get Reminder By ID
* Delete Reminder
* Task Ownership Validation
* Scheduled Reminder Support
* Email Automation Integration
* In-App Notification Integration
* User Data Isolation

---

# Module Architecture

```text id="9q7h2v"
Client

│

▼

Authentication Middleware

│

▼

Reminder Controller

│

▼

Validate Task Ownership

│

▼

PostgreSQL

│

▼

Reminder Job (Cron)

│

├──────────────┐

▼              ▼

Email       Notification

│              │

▼              ▼

User Inbox   App Notification
```

---

# Folder Structure

```text id="4v5j0w"
src/
├── controllers/
│      reminder.controller.js
│
├── routes/
│      reminder.routes.js
│
├── jobs/
│      reminder.job.js
│
├── services/
│      email.service.js
│      notification.service.js
│
├── templates/
│      reminder.template.js
│
└── config/
       db_config.js
```

---

# Database Schema

## reminders

| Column     | Type      | Description     |
| ---------- | --------- | --------------- |
| id         | UUID      | Primary Key     |
| task_id    | UUID      | Parent Task     |
| remind_at  | TIMESTAMP | Reminder Time   |
| sent       | BOOLEAN   | Reminder Status |
| created_at | TIMESTAMP | Created Time    |
| updated_at | TIMESTAMP | Updated Time    |

---

# Authentication

All Reminder APIs require authentication.

Current user

```javascript id="d1u6ar"
req.user.id
```

---

# API Endpoints

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | /api/reminders     | Create Reminder    |
| GET    | /api/reminders     | Get All Reminders  |
| GET    | /api/reminders/:id | Get Reminder By ID |
| DELETE | /api/reminders/:id | Delete Reminder    |

---

# Create Reminder

## Request

```http id="7ov4mz"
POST /api/reminders
```

### Request Body

```json id="lh8vkp"
{
    "task_id":"task_uuid",
    "remind_at":"2026-07-01T18:00:00Z"
}
```

### Success Response

```json id="szxtv8"
{
    "success":true,
    "reminder":{}
}
```

---

# Get All Reminders

## Request

```http id="kp31po"
GET /api/reminders
```

### Success Response

```json id="mqc7zh"
{
    "success":true,
    "count":3,
    "reminders":[]
}
```

Each reminder also contains

```text id="xtvv6x"
task_title
```

using an SQL JOIN.

---

# Get Reminder By ID

## Request

```http id="h4pdr2"
GET /api/reminders/:id
```

### Success Response

```json id="n6k38k"
{
    "success":true,
    "reminder":{}
}
```

---

# Delete Reminder

## Request

```http id="zhhhn2"
DELETE /api/reminders/:id
```

### Success Response

```json id="vttnsa"
{
    "success":true,
    "message":"Reminder deleted successfully"
}
```

---

# Business Logic

## Create Reminder

```text id="yvjlwm"
Receive Request

↓

Validate Task

↓

Verify Task Ownership

↓

Insert Reminder

↓

sent = false

↓

Return Reminder
```

---

# Background Automation

The Reminder Module works together with the Reminder Job.

```text id="jlwmx1"
Reminder Created

↓

Database

↓

Cron Job

↓

Find Due Reminder

↓

Send Email

↓

Create Notification

↓

Update sent = true
```

---

# Reminder Lifecycle

```text id="jlwmx2"
Create Reminder

↓

sent = false

↓

Waiting

↓

Reminder Time Reached

↓

Cron Job

↓

Email Sent

↓

Notification Created

↓

sent = true
```

---

# Reminder Status

| Value | Meaning                         |
| ----- | ------------------------------- |
| false | Reminder has not been processed |
| true  | Reminder already sent           |

---

# Relationship

```text id="jlwmx3"
User

│

▼

Subject

│

▼

Task

│

▼

Reminder

│

▼

Email

+

Notification
```

---

# Email Automation

When the scheduled time arrives

```text id="jlwmx4"
Reminder

↓

Email Service

↓

Reminder Template

↓

SMTP

↓

User Inbox
```

Example Email

```text id="jlwmx5"
📚 Student Productivity Automation

Hello Harsh,

Your task "Learn DBMS" is due soon.
```

---

# In-App Notification

The Reminder Job automatically creates

```text id="jlwmx6"
Task Reminder

Learn DBMS is due soon.
```

which appears in the Notifications page.

---

# Security

Task ownership is verified before creating reminders.

```sql id="jlwmx7"
SELECT *

FROM tasks

WHERE id = $1

AND user_id = $2
```

Users cannot create reminders for another user's task.

---

# Test Cases

## Create Reminder

### ✅ Valid Reminder

```json id="jlwmx8"
{
    "task_id":"valid_task_uuid",
    "remind_at":"2026-07-01T18:00:00Z"
}
```

Expected

```text id="jlwmx9"
201 Created
```

---

### ❌ Missing Task ID

Expected

```text id="jlwm10"
400 Task ID and remind_at are required
```

---

### ❌ Missing Reminder Time

Expected

```text id="jlwm11"
400 Task ID and remind_at are required
```

---

### ❌ Invalid Task

Expected

```text id="jlwm12"
404 Task not found
```

---

### ❌ Unauthorized User

Expected

```text id="jlwm13"
401 Unauthorized
```

---

# Get All Reminders

### ✅ Existing Reminders

Expected

```text id="jlwm14"
200 OK
```

---

### ✅ No Reminders

Expected

```json id="jlwm15"
{
    "success":true,
    "count":0,
    "reminders":[]
}
```

---

# Get Reminder By ID

### ✅ Valid Reminder

Expected

```text id="’wini16"
200 OK
```

---

### ❌ Reminder Not Found

Expected

```text id="’wini17"
404 Reminder not found
```

---

# Delete Reminder

### ✅ Existing Reminder

Expected

```text id="’wini18"
200 Reminder deleted successfully
```

---

### ❌ Already Deleted

Expected

```text id="’wini19"
404 Reminder not found
```

---

# Automation Test

## Scenario

1. Register and login.
2. Create a Subject.
3. Create a Task.
4. Create a Reminder for 2 minutes in the future.
5. Start the backend server.
6. Wait until the scheduled time.

Expected Results

* ✅ Reminder Job detects the reminder.
* ✅ Reminder email is sent.
* ✅ Notification is inserted into the database.
* ✅ `sent` becomes `true`.

---

# Error Responses

| Status | Description             |
| ------ | ----------------------- |
| 400    | Missing Required Fields |
| 401    | Unauthorized            |
| 404    | Task Not Found          |
| 404    | Reminder Not Found      |
| 500    | Internal Server Error   |

---

# API Usage Flow

```text id="’wini20"
Register

↓

Login

↓

Create Subject

↓

Create Task

↓

Create Reminder

↓

Cron Job

↓

Email Sent

↓

Notification Created

↓

Reminder Marked Sent
```

---

# Future Improvements

* Edit Reminder
* Snooze Reminder
* Multiple Reminders Per Task
* Recurring Reminders
* Push Notifications
* SMS Notifications
* WhatsApp Notifications
* Reminder History
* Timezone Support
* Reminder Priority
* Reminder Templates

---

# Module Summary

* ✅ JWT Protected APIs
* ✅ Complete Reminder CRUD
* ✅ Task Ownership Validation
* ✅ PostgreSQL Integration
* ✅ Background Cron Job Integration
* ✅ Automated Email Notifications
* ✅ Automated In-App Notifications
* ✅ Reminder Status Tracking (`sent`)
* ✅ Production-Ready Automation Workflow

The Reminder Module is one of the most advanced modules in the Student Productivity Automation backend. It combines REST APIs, scheduled background jobs, email delivery, and in-app notifications to provide a complete reminder automation system similar to those used in real-world productivity applications.