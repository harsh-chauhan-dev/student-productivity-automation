import express from 'express';
import { createReminder, getAllReminders, getReminderById, deleteReminder } from '../controller/reminder.js';
import { auth } from '../../auth/middleware/auth.middleware.js';

const router = express.Router();

router.post("/", auth, createReminder);

router.get("/", auth, getAllReminders);

router.get("/:id", auth, getReminderById);

router.delete("/:id", auth, deleteReminder);

export default router;