import express from 'express';
import { createTask, getAllTask, getTaskById, deleteTask, updateTask } from '../controller/task.Controller.js'
import { auth } from '../../../middleware/authMiddleWare.js';
const routes = express.Router();


routes.post('/create/task', auth, createTask);
routes.get('/get/tasks', auth, getAllTask);
routes.put('/update/task/:id', auth, updateTask);
routes.get('/get/task/:id', auth, getAllTask);
routes.delete('/delete/task/:id', auth, deleteTask);

export default routes
