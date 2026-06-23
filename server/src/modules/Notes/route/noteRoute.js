import { createNotes, getAllNotes ,getNoteById,updateNote,deleteNote,searchNotes } from '../controller/notes.controller.js'
import express from 'express';
import { auth } from '../../../middleware/authMiddleWare.js'

const route = express.Router();

route.post('/create/notes', auth, createNotes);
route.get('/get/notes', auth, getAllNotes);
route.get('/get/note/:id', auth, getNoteById);
route.put('/update/note/:id', auth, updateNote);
route.delete('/delete/note/:id', auth, deleteNote);
route.get('/search', auth, searchNotes);
export default route;