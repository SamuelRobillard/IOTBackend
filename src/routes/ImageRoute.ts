import express, { Request, Response } from 'express';
import multer from 'multer';
import { ImageController } from '../controller/ImageController';



const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });  // Limit to 10MB

 const imageController  = new ImageController
router.post('/upload-image', upload.single('image'), imageController.uploadImage);

export default router;
