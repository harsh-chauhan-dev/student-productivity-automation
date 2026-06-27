# 📝 Notes Management Module

The Notes Management Module enables students to create, organize, update, search, and manage study notes for different subjects. It serves as a personal knowledge management system where users can store important concepts, formulas, summaries, and revision material.

Unlike a basic notes application, every note is securely associated with an authenticated user and a specific subject.

---

# Overview

A note belongs to a user and a subject.

Example

```text id="q2a9xh"
User

↓

Database Management System

↓

Notes

├── SQL Commands
├── Normalization
├── ACID Properties
└── Transactions
```

Students can quickly search notes using keywords in either the title or content.

---

# Features

* Create Note
* Get All Notes
* Get Note By ID
* Update Note
* Delete Note
* Search Notes
* Subject Organization
* User Data Isolation
* Full-Text Search using PostgreSQL ILIKE

---

# Module Architecture

```text id="w3x6mk"
Client

│

▼

Authentication Middleware

│

▼

Notes Controller

│

▼

Validate User

│

▼

PostgreSQL

│

▼

JSON Response
```

---

# Folder Structure

```text id="x4v2jb"
src/
├── controllers/
│      notes.controller.js
│
├── routes/
│      notes.routes.js
│
├── middleware/
│      auth.middleware.js
│
└── config/
       db_config.js
```

---

# Database Schema

## notes

| Column     | Type      | Description     |
| ---------- | --------- | --------------- |
| id         | UUID      | Primary Key     |
| user_id    | UUID      | Note Owner      |
| subject_id | UUID      | Related Subject |
| title      | VARCHAR   | Note Title      |
| content    | TEXT      | Note Content    |
| created_at | TIMESTAMP | Created Time    |
| updated_at | TIMESTAMP | Last Updated    |

---

# Authentication

All Notes APIs require authentication.

Authenticated user

```javascript id="j9e5lf"
req.user.id
```

Every query filters notes using the current user's ID.

---

# API Endpoints

| Method | Endpoint                    | Description    |
| ------ | --------------------------- | -------------- |
| POST   | /api/notes                  | Create Note    |
| GET    | /api/notes                  | Get All Notes  |
| GET    | /api/notes/:id              | Get Note By ID |
| PUT    | /api/notes/:id              | Update Note    |
| DELETE | /api/notes/:id              | Delete Note    |
| GET    | /api/notes/search?q=keyword | Search Notes   |

---

# Create Note

## Request

```http id="m8v1zk"
POST /api/notes
```

### Request Body

```json id="y5l2qa"
{
    "subject_id":"subject_uuid",
    "title":"SQL JOIN",
    "content":"INNER JOIN returns matching records..."
}
```

### Success Response

```json id="b4r9pv"
{
    "success":true,
    "message":"Note created successfully",
    "note":{}
}
```

---

# Get All Notes

## Request

```http id="r7p3nh"
GET /api/notes
```

### Success Response

```json id="h6k8dt"
{
    "success":true,
    "count":5,
    "notes":[]
}
```

Notes are returned in descending order of their last update.

---

# Get Note By ID

## Request

```http id="c1v7qx"
GET /api/notes/:id
```

### Success Response

```json id="t2z9uw"
{
    "success":true,
    "notes":{}
}
```

---

# Update Note

## Request

```http id="l5n4er"
PUT /api/notes/:id
```

### Request Body

```json id="p8f6ja"
{
    "title":"Advanced SQL JOIN",
    "content":"INNER JOIN, LEFT JOIN, RIGHT JOIN..."
}
```

### Success Response

```json id="d9q2mc"
{
    "success":true,
    "note":{}
}
```

---

# Delete Note

## Request

```http id="g4s1by"
DELETE /api/notes/:id
```

### Success Response

```json id="z3m8lv"
{
    "success":true,
    "message":"Note deleted successfully"
}
```

---

# Search Notes

## Request

```http id="u6r5nk"
GET /api/notes/search?q=sql
```

### Success Response

```json id="n1x7tw"
{
    "success":true,
    "count":2,
    "notes":[]
}
```

Search is performed against both

* Note Title
* Note Content

using PostgreSQL `ILIKE`.

---

# Business Logic

## Create Note

```text id="j7p6ka"
Receive Request

↓

Validate Required Fields

↓

Insert Note

↓

Return Created Note
```

---

## Update Note

```text id="q5r2yb"
Receive Request

↓

Validate Ownership

↓

Update Title

↓

Update Content

↓

Update Timestamp

↓

Return Updated Note
```

---

## Search Notes

```text id="v8k4zn"
Receive Search Query

↓

Search Title

+

Search Content

↓

Return Matching Notes
```

---

# Search Workflow

The search API uses

```sql id="e2y6pq"
ILIKE '%keyword%'
```

Example

```text id="f1m8xr"
Keyword

SQL

↓

Matches

SQL JOIN

SQL Index

Advanced SQL

Database SQL Commands
```

---

# Relationship

```text id="a9w3lc"
User

│

▼

Subject

│

▼

Notes
```

Each subject can contain multiple notes.

---

# Security

Every operation is restricted to the authenticated user.

Example

```sql id="b7q5eh"
SELECT *

FROM notes

WHERE id = $1

AND user_id = $2
```

This prevents users from accessing another user's notes.

---

# Test Cases

## Create Note

### ✅ Valid Request

```json id="y4p8dn"
{
    "subject_id":"valid_subject_uuid",
    "title":"Normalization",
    "content":"Normalization reduces redundancy."
}
```

Expected

```text id="k3v7jm"
201 Created
```

---

### ❌ Missing Subject

Expected

```text id="r5t2cp"
400 All fields are required
```

---

### ❌ Missing Title

Expected

```text id="h8j1fz"
400 All fields are required
```

---

### ❌ Missing Content

Expected

```text id="x6m9qr"
400 All fields are required
```

---

# Get All Notes

### ✅ Existing Notes

Expected

```text id="c2w4nb"
200 OK
```

---

### ✅ No Notes

Expected

```json id="g5e1yk"
{
    "success":true,
    "count":0,
    "notes":[]
}
```

---

# Get Note By ID

### ✅ Valid Note

Expected

```text id="d4n8ts"
200 OK
```

---

### ❌ Invalid Note ID

Expected

```text id="u7p6lx"
404 Note not found
```

---

# Update Note

### ✅ Valid Update

Expected

```text id="m3z2kh"
200 OK
```

---

### ❌ Missing Title

Expected

```text id="n9x5cf"
400 Title and content are required
```

---

### ❌ Missing Content

Expected

```text id="j1r8va"
400 Title and content are required
```

---

### ❌ Invalid Note

Expected

```text id="p6w4dy"
404 Note not found
```

---

# Delete Note

### ✅ Existing Note

Expected

```text id="f8h7ks"
200 Note deleted successfully
```

---

### ❌ Already Deleted

Expected

```text id="l2v5pq"
404 Note not found
```

---

# Search Notes

### ✅ Search by Title

Query

```text id="w1n4gc"
sql
```

Expected

```text id="z7r8my"
Matching Notes Returned
```

---

### ✅ Search by Content

Query

```text id="q4m9tb"
normalization
```

Expected

```text id="h5j2wr"
Matching Notes Returned
```

---

### ❌ Empty Search Query

Expected

```text id="y6p1nk"
400 Search query is required
```

---

### ✅ No Matching Notes

Expected

```json id="r9x8du"
{
    "success":true,
    "count":0,
    "notes":[]
}
```

---

# Error Responses

| Status | Description             |
| ------ | ----------------------- |
| 400    | Missing Required Fields |
| 400    | Search Query Missing    |
| 401    | Unauthorized            |
| 404    | Note Not Found          |
| 500    | Internal Server Error   |

---

# API Usage Flow

```text id="k2v6je"
Register

↓

Login

↓

Create Subject

↓

Create Note

↓

Get Notes

↓

Search Notes

↓

Update Note

↓

Delete Note
```

---

# Future Improvements

* Markdown Support
* Rich Text Editor
* Note Tags
* Favorite Notes
* Pin Notes
* Image Attachments
* File Uploads
* Note Sharing
* Version History
* Soft Delete
* Full-Text Search (PostgreSQL `tsvector`)
* AI Note Summarization
* Export Notes (PDF/Markdown)

---

# Module Summary

* ✅ JWT Protected APIs
* ✅ Complete CRUD Operations
* ✅ Subject-Based Organization
* ✅ PostgreSQL Integration
* ✅ Full-Text Search using `ILIKE`
* ✅ User Data Isolation
* ✅ Automatic Update Timestamp
* ✅ Search by Title and Content

The Notes Management Module serves as the student's personal knowledge repository. It allows efficient storage, organization, and retrieval of study material while providing secure user isolation and keyword-based search capabilities, making it an essential component of the Student Productivity Automation system.