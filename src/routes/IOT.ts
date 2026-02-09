import express, { Request, Response } from 'express';
import multer from 'multer';
import { ImageController } from '../controller/ImageController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { IOTController } from '../controller/IOTController';



const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });  // Limit to 10MB /what the ia can handle

 const imageController  = new ImageController
 const iOTController  = new IOTController
router.post('/upload-image', upload.single('image'), authMiddleware, adminMiddleware, imageController.uploadImage);
router.post('/jeter/:categorieJeter',iOTController.verificationJeter);

export default router;
