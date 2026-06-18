import { registerUser, loginUser } from '../controller/aurh.controller.js'
import express from 'express';
import {auth} from '../middleware/authMiddleWare.js'

const router = express.Router();
router.post('/register',registerUser);
router.post('/login',loginUser);

export default router;