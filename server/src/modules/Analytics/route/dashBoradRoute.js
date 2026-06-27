import express from 'express';
import {getDashBoradAnalytics } from '../controller/dashboard.js';
import { auth } from '../../../middleware/authMiddleWare.js';

const route = express.Router();

route.get('/dashboard', auth, getDashBoradAnalytics);

export default route;