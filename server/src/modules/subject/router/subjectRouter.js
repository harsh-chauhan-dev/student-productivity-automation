import express from 'express';
import { auth } from '../../../middleware/authMiddleWare.js';
import { createSubject,getAllSubject,getSubjectById,updateSubject,deleteSubject } from '../controller/subject.controller.js';
const router = express.Router();

router.post('/create-subject', auth, createSubject);
router.get('/getall-subject', auth, getAllSubject);
router.get('/getsubject/:id', auth, getAllSubject);
router.put('/update-subject/:id', auth, updateSubject);
router.delete('/delete-subject/:id', auth, deleteSubject);
export default router;