# 📚 Subject Management Module

The Subject Management Module allows authenticated users to organize their studies by creating subjects. Every subject belongs to a specific user and acts as a parent for tasks, study sessions, notes, and analytics.

---

# Overview

This module provides CRUD (Create, Read, Update, Delete) operations for subjects while ensuring complete user data isolation.

Every subject belongs to exactly one authenticated user.

Example:

```text
Harsh

Subjects
├── DBMS
├── Operating System
├── Computer Networks
└── Data Structures
```

Another user cannot access or modify Harsh's subjects.

---

# Features

* Create Subject
* Get All Subjects
* Get Subject by ID
* Update Subject
* Delete Subject
* User-specific data isolation
* JWT Protected APIs
* PostgreSQL Integration

---

# Module Architecture

```text
Client

│

▼

Authentication Middleware

│

▼

Subject Controller

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
│      subject.controller.js
│
├── routes/
│      subject.routes.js
│
├── middleware/
│      auth.middleware.js
│
└── config/
       db_config.js
```

---

# Database Schema

## subjects

| Column                | Type      | Description       |
| --------------------- | --------- | ----------------- |
| id                    | UUID      | Primary Key       |
| user_id               | UUID      | Owner of subject  |
| name                  | VARCHAR   | Subject Name      |
| color_hex             | VARCHAR   | UI Color          |
| target_hours_per_week | INTEGER   | Weekly Study Goal |
| created_at            | TIMESTAMP | Created Time      |
| updated_at            | TIMESTAMP | Updated Time      |

---

# Authentication

All Subject APIs require authentication.

```
Authorization

JWT Access Token
```

User ID is extracted from

```javascript
req.user.id
```

---

# API Endpoints

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| POST   | /api/subjects     | Create Subject    |
| GET    | /api/subjects     | Get All Subjects  |
| GET    | /api/subjects/:id | Get Subject By ID |
| PUT    | /api/subjects/:id | Update Subject    |
| DELETE | /api/subjects/:id | Delete Subject    |

---

# Create Subject

## Request

```
POST /api/subjects
```

### Request Body

```json
{
    "name":"Database Management System",
    "color_hex":"#2563EB",
    "target_hours_per_week":10
}
```

### Success Response

```json
{
    "success":true,
    "subject":{
        "id":"uuid",
        "name":"Database Management System",
        "color_hex":"#2563EB",
        "target_hours_per_week":10
    }
}
```

---

# Get All Subjects

## Request

```
GET /api/subjects
```

### Success Response

```json
{
    "success":true,
    "count":2,
    "subjects":[]
}
```

Subjects are returned in descending order of creation.

---

# Get Subject By ID

## Request

```
GET /api/subjects/:id
```

### Success Response

```json
{
    "success":true,
    "subject":{
        "id":"uuid",
        "name":"DBMS"
    }
}
```

---

# Update Subject

## Request

```
PUT /api/subjects/:id
```

### Request Body

```json
{
    "name":"Advanced DBMS",
    "color_hex":"#3B82F6",
    "target_hours_per_week":15
}
```

### Success Response

```json
{
    "success":true,
    "message":"Subject updated successfully",
    "subject":{}
}
```

---

# Delete Subject

## Request

```
DELETE /api/subjects/:id
```

### Success Response

```json
{
    "success":true,
    "message":"Subject deleted successfully"
}
```

---

# Business Logic

## Create

```
Validate Input

↓

Authenticated User

↓

Insert Subject

↓

Return Created Subject
```

---

## Read

```
Authenticated User

↓

Find Subjects

↓

Return Only Current User Subjects
```

---

## Update

```
Check Subject Ownership

↓

Update Record

↓

Return Updated Subject
```

---

## Delete

```
Check Ownership

↓

Delete Subject

↓

Return Success Message
```

---

# Security

Every query filters by

```sql
user_id = req.user.id
```

This guarantees that users cannot access each other's subjects.

Example

```sql
SELECT *
FROM subjects
WHERE id=$1
AND user_id=$2;
```

---

# Test Cases

## Create Subject

### ✅ Valid Subject

```json
{
    "name":"DBMS",
    "color_hex":"#3B82F6",
    "target_hours_per_week":12
}
```

Expected

```
201 Created
```

---

### ❌ Missing Name

```json
{
    "color_hex":"#3B82F6"
}
```

Expected

```
400 Bad Request
```

---

### ❌ Unauthorized User

No JWT token.

Expected

```
401 Unauthorized
```

---

# Get All Subjects

### ✅ Existing Subjects

Expected

```
200 OK

Count > 0
```

---

### ✅ No Subjects

Expected

```json
{
    "success":true,
    "count":0,
    "subjects":[]
}
```

---

# Get Subject By ID

### ✅ Valid Subject ID

Expected

```
200 OK
```

---

### ❌ Invalid UUID

Expected

```
400 Bad Request
```

---

### ❌ Subject Doesn't Exist

Expected

```
404 Not Found
```

---

### ❌ Access Another User's Subject

Expected

```
404 Not Found
```

---

# Update Subject

### ✅ Update Name

Expected

```
200 OK
```

---

### ❌ Invalid Subject ID

Expected

```
404 Not Found
```

---

### ❌ Unauthorized Update

Expected

```
404 Not Found
```

---

# Delete Subject

### ✅ Existing Subject

Expected

```
200 OK
```

---

### ❌ Already Deleted

Expected

```
404 Subject Not Found
```

---

# Error Responses

| Status | Description           |
| ------ | --------------------- |
| 400    | Missing Subject Name  |
| 401    | Unauthorized          |
| 404    | Subject Not Found     |
| 500    | Internal Server Error |

---

# API Usage Flow

```
Register

↓

Login

↓

Receive JWT

↓

Create Subject

↓

Get Subjects

↓

Update Subject

↓

Delete Subject
```

---

# Future Improvements

* Subject search
* Subject pagination
* Favorite subjects
* Archive subjects
* Subject icons
* Subject completion percentage
* Total study hours per subject
* Subject analytics dashboard
* Soft delete support

---

# Module Summary

✅ User Authentication Required

✅ Complete CRUD Operations

✅ User Data Isolation

✅ PostgreSQL Database

✅ RESTful API Design

✅ Secure Ownership Validation

This module acts as the foundation for Tasks, Study Sessions, Notes, Analytics, and Reminder modules, since every academic activity is organized under a subject.