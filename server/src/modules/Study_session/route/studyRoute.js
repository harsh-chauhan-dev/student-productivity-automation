import express from 'express';
import { startStudySession, endStudySession, getAllSessions, getSessionById, deleteSession } from '../controller/study.controller.js';
import { auth } from '../../../middleware/authMiddleWare.js';


const router = express.Router();


router.post("/start", auth, startStudySession);

router.post("/end/:id", auth, endStudySession);

router.get("/", auth, getAllSessions);

router.get("/:id", auth, getSessionById);

router.delete("/:id", auth, deleteSession);

export default router;