import exprss from 'express';
import { getAllNotifications, getNotificationById, deleteNotification,markAsRead } from '../controller/notification.controller.js';
import { auth } from '../../../middleware/authMiddleWare.js';


const router = exprss.Router();
router.get("/", auth, getAllNotifications);

router.get("/:id", auth, getNotificationById);

router.patch("/:id/read",auth, markAsRead);

router.delete("/:id", auth, deleteNotification);


export default router;


