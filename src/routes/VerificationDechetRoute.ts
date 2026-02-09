import express, { Request, Response } from 'express';
import multer from 'multer';

import { NotificationsController } from '../controller/NotificationController';



const router = express.Router();


const storage = multer.memoryStorage();
const notificationsController = new NotificationsController();


router.get('/notif', notificationsController.getAllNotifs);
router.post('/notif', notificationsController.createNotif);
router.post('/notif/:categoriePoubelle', notificationsController.updateNotif);

export default router;
