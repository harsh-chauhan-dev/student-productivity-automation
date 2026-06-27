# 🔐 Authentication Module

The Authentication Module is responsible for user registration, login, profile management, logout, and JWT-based authentication using access and refresh tokens.

---

# Features

* User Registration
* User Login
* JWT Access Token
* JWT Refresh Token
* HTTP-Only Cookies
* Password Hashing using bcrypt
* User Profile API
* Logout
* Token Refresh
* Email Validation
* Password Validation

---

# Authentication Flow

```text
Client
   │
   ▼
Register
   │
   ▼
User Created
   │
   ▼
Login
   │
   ▼
Generate Access Token (15 min)
Generate Refresh Token (7 days)
   │
   ▼
Store Refresh Token in Database
   │
   ▼
Send Tokens as HTTP-Only Cookies
   │
   ▼
Protected Routes
```

---

# API Endpoints

| Method | Endpoint                  | Description               | Authentication |
| ------ | ------------------------- | ------------------------- | -------------- |
| POST   | `/api/auth/register`      | Register new user         | ❌              |
| POST   | `/api/auth/login`         | Login user                | ❌              |
| GET    | `/api/auth/profile`       | Get current user profile  | ✅              |
| POST   | `/api/auth/logout`        | Logout current user       | ✅              |
| POST   | `/api/auth/refresh-token` | Generate new access token | Refresh Cookie |

---

# Register User

## Request

```http
POST /api/auth/register
```

### Body

```json
{
    "name":"Harsh Chauhan",
    "email":"harsh@gmail.com",
    "password":"password123"
}
```

### Success Response

```json
{
    "success":true,
    "message":"User registered successfully",
    "user":{
        "id":"uuid",
        "name":"Harsh Chauhan",
        "email":"harsh@gmail.com"
    }
}
```

---

# Login User

## Request

```http
POST /api/auth/login
```

### Body

```json
{
    "email":"harsh@gmail.com",
    "password":"password123"
}
```

### Success Response

```json
{
    "success":true,
    "message":"Login successful",
    "user":{
        "id":"uuid",
        "name":"Harsh Chauhan",
        "email":"harsh@gmail.com"
    }
}
```

### Cookies Created

```
token
refreshToken
```

Both cookies are:

* HTTP Only
* SameSite Strict
* Secure in Production

---

# Get Profile

## Request

```http
GET /api/auth/profile
```

Headers

```
Cookie:
token=...
```

Response

```json
{
    "success":true,
    "user":{
        "id":"uuid",
        "name":"Harsh",
        "email":"harsh@gmail.com",
        "created_at":"..."
    }
}
```

---

# Logout

## Request

```http
POST /api/auth/logout
```

Response

```json
{
    "success":true,
    "message":"Logout Successful"
}
```

Actions performed

* Refresh token removed from database
* Access token cookie cleared
* Refresh token cookie cleared

---

# Refresh Access Token

## Request

```http
POST /api/auth/refresh-token
```

Requires

```
refreshToken Cookie
```

Response

```json
{
    "success":true,
    "message":"Access token refreshed"
}
```

---

# Validation Rules

## Register

| Field    | Rule                 |
| -------- | -------------------- |
| name     | Required             |
| email    | Valid Email          |
| password | Minimum 6 characters |

---

# Password Security

Passwords are never stored directly.

Workflow

```
Password

↓

bcrypt.genSalt()

↓

bcrypt.hash()

↓

Database
```

---

# Login Workflow

```
User Login

↓

Find User by Email

↓

Compare Password using bcrypt

↓

Generate JWT Access Token

↓

Generate Refresh Token

↓

Store Refresh Token

↓

Send Cookies

↓

Login Success
```

---

# Token Strategy

| Token         | Expiry     | Storage                     |
| ------------- | ---------- | --------------------------- |
| Access Token  | 15 Minutes | HTTP-Only Cookie            |
| Refresh Token | 7 Days     | Database + HTTP-Only Cookie |

---

# Error Responses

| Status | Reason                |
| ------ | --------------------- |
| 400    | Missing Fields        |
| 400    | Invalid Email         |
| 400    | Weak Password         |
| 401    | Invalid Password      |
| 401    | Invalid Refresh Token |
| 404    | User Not Found        |
| 409    | User Already Exists   |
| 500    | Internal Server Error |

---

# Test Cases

## Register

### ✅ Valid Registration

```
Input

Name
Harsh

Email
harsh@gmail.com

Password
password123

Expected

201 Created
```

---

### ❌ Missing Name

```
{
    "email":"harsh@gmail.com",
    "password":"password123"
}
```

Expected

```
400 Bad Request
```

---

### ❌ Invalid Email

```
abc.com
```

Expected

```
400 Invalid Email Format
```

---

### ❌ Short Password

```
123
```

Expected

```
400 Password must be at least 6 characters
```

---

### ❌ Duplicate Email

Register same email twice.

Expected

```
409 User already exists
```

---

# Login Tests

### ✅ Correct Credentials

Expected

```
200 OK
Cookies Created
```

---

### ❌ Wrong Password

Expected

```
401 Invalid Password
```

---

### ❌ Unknown Email

Expected

```
404 Email does not exist
```

---

# Profile Tests

### ✅ Logged In User

Expected

```
200 User Data
```

---

### ❌ Without Token

Expected

```
401 Unauthorized
```

---

# Logout Tests

### ✅ Logged In

Expected

```
Refresh Token Deleted
Cookies Cleared
```

---

# Refresh Token Tests

### ✅ Valid Refresh Token

Expected

```
New Access Token
```

---

### ❌ Expired Refresh Token

Expected

```
401 Invalid Refresh Token
```

---

# Security Features

* Password hashing using bcrypt
* JWT authentication
* HTTP-only cookies
* Refresh token rotation support
* Refresh token stored in database
* Protected profile endpoint
* Email validation
* Password validation

---

# Future Improvements

* Email verification
* Forgot password
* Password reset
* Account activation
* Login rate limiting
* OAuth (Google/GitHub)
* Multi-factor authentication (MFA)
* Session management
* Device tracking
* Login history