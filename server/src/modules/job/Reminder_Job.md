# ⚙️ Reminder Automation Job

The Reminder Automation Job is a background scheduler responsible for automatically processing due reminders. It continuously monitors pending reminders, sends reminder emails, creates in-app notifications, and marks reminders as processed.

Unlike REST APIs, this module runs independently in the background without requiring any user interaction.

---

# Overview

The Reminder Job is powered by **node-cron** and executes every minute.

Its responsibilities include:

* Detecting due reminders
* Sending reminder emails
* Creating in-app notifications
* Preventing duplicate reminders
* Logging reminder processing

---

# Features

* Background Scheduler
* Automatic Reminder Processing
* Email Notification Integration
* In-App Notification Creation
* Duplicate Prevention
* Error Isolation
* PostgreSQL Integration
* Production-Ready Automation

---

# Architecture

```text
Node.js Server

│

▼

node-cron Scheduler

(Runs Every Minute)

│

▼

Query Due Reminders

│

▼

For Each Reminder

│

├───────────────┐

▼               ▼

Email Service   Notification Service

│               │

▼               ▼

SMTP          PostgreSQL

│

▼

Update Reminder Status

(sent = true)
```

---

# Folder Structure

```text
src/
├── jobs/
│      reminder.job.js
│
├── services/
│      email.service.js
│
├── template/
│      reminder.template.js
│
├── config/
│      db_config.js
│
└── server.js
```

---

# Execution Schedule

The scheduler runs every minute.

```javascript
cron.schedule("* * * * *")
```

Cron Expression

| Expression  | Meaning      |
| ----------- | ------------ |
| `* * * * *` | Every minute |

---

# Workflow

```text
Server Starts

↓

Reminder Job Starts

↓

Every Minute

↓

Find Due Reminders

↓

For Each Reminder

↓

Send Email

↓

Create Notification

↓

Mark Reminder Sent

↓

Wait For Next Execution
```

---

# Reminder Query

The scheduler fetches all pending reminders.

Conditions

```sql
sent = false

AND

remind_at <= NOW()
```

This guarantees

* Only pending reminders are processed.
* Past reminders are immediately executed.
* Duplicate reminders are avoided.

---

# Reminder Processing

For every reminder found

```text
Reminder

↓

Generate Email

↓

Send Email

↓

Insert Notification

↓

Update Reminder

↓

sent = true
```

---

# Email Automation

The Reminder Job integrates with

```text
Email Service

↓

Reminder Template

↓

SMTP Server

↓

User Inbox
```

Example Email

```text
📚 Student Productivity Automation

Hello Harsh,

Learn DBMS is due soon.
```

---

# Notification Automation

After sending the email

```sql
INSERT INTO notifications
```

Example

```text
Task Reminder

Learn DBMS is due soon.
```

The notification is immediately available inside the application.

---

# Duplicate Prevention

Initially

```text
sent = false
```

After successful processing

```sql
UPDATE reminders

SET sent = true
```

Result

```text
Reminder

↓

Processed Once

↓

Ignored During Next Cron Execution
```

---

# Error Handling

Each reminder is processed independently.

```text
Reminder 1

↓

Success

──────────────

Reminder 2

↓

SMTP Error

──────────────

Reminder 3

↓

Success
```

A failure in one reminder does **not** stop the processing of remaining reminders.

---

# Logging

Example Console Output

```text
Checking reminder....

Reminder processed:
071c284b-1653...

Checking reminder....

Reminder processed:
4c28bc92...
```

---

# Dependencies

This job depends on

* PostgreSQL Database
* Email Service
* Reminder Email Template
* Notification Table
* Reminder Table
* node-cron

---

# Integration

The Reminder Job works together with

```text
Reminder Module

↓

Reminder Job

↓

Email Service

↓

Notification Module
```

---

# Complete Reminder Lifecycle

```text
User Creates Reminder

↓

Reminder Saved

↓

sent = false

↓

Cron Job

↓

Reminder Time Reached

↓

Send Email

↓

Create Notification

↓

Update Reminder

↓

sent = true
```

---

# Test Cases

## ✅ Reminder Found

Database

```text
sent = false

remind_at <= NOW()
```

Expected

* Email Sent
* Notification Created
* Reminder Updated

---

## ✅ No Due Reminder

Database

```text
remind_at > NOW()
```

Expected

```text
Checking reminder....
```

No emails or notifications.

---

## ✅ Already Processed Reminder

Database

```text
sent = true
```

Expected

Reminder ignored.

---

## ❌ SMTP Failure

Simulate invalid SMTP credentials.

Expected

* Error logged
* Remaining reminders continue processing

---

## ❌ Database Failure

Disconnect PostgreSQL.

Expected

* Job catches exception
* Server continues running

---

## Automation Test

### Scenario

1. Register a user.
2. Login.
3. Create Subject.
4. Create Task.
5. Create Reminder for one minute later.
6. Start the backend server.
7. Wait.

Expected Results

* Reminder Job detects reminder.
* Email arrives in user's inbox.
* Notification is created.
* `sent` becomes `true`.
* Reminder is not processed again.

---

# Performance

Time Complexity

```text
O(n)
```

where **n** is the number of due reminders.

Each reminder is processed exactly once.

---

# Security

* Only reminders belonging to registered users are processed.
* User email addresses are retrieved through SQL JOINs.
* Duplicate reminders are prevented using the `sent` flag.
* Reminder ownership is enforced through task ownership.

---

# Future Improvements

* Reminder Retry Queue
* Exponential Backoff
* Batch Email Sending
* Push Notifications
* SMS Notifications
* WhatsApp Notifications
* Reminder Priorities
* Recurring Reminders
* Distributed Workers (BullMQ)
* Redis Queue Integration
* Dead Letter Queue
* Email Delivery Tracking
* Reminder Analytics Dashboard

---

# Module Summary

* ✅ Automated Background Processing
* ✅ Runs Every Minute
* ✅ node-cron Scheduler
* ✅ PostgreSQL Integration
* ✅ Automatic Email Delivery
* ✅ Automatic In-App Notifications
* ✅ Duplicate Prevention
* ✅ Independent Error Handling
* ✅ Production-Ready Background Worker

The Reminder Automation Job is the core automation engine of the Student Productivity Automation system. It connects the Reminder Module, Email Service, and Notification Module into a fully automated workflow, ensuring students receive timely reminders without manual intervention. This demonstrates real-world backend concepts such as background processing, scheduled jobs, service orchestration, and asynchronous task execution.