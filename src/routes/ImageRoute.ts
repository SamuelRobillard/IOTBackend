import express, { Request, Response } from 'express';
import multer from 'multer';


const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });  // Limit to 10MB


router.post('/upload-image', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }


  const imageBase64 = req.file.buffer.toString('base64');
  const imageType = req.file.mimetype; 

  // see the image in browser
  const imageHtml = `
    <html>
      <body>
        <h1>Uploaded Image</h1>
        <img src="data:${imageType};base64,${imageBase64}" alt="Uploaded Image" />
      </body>
    </html>
  `;

  
  res.status(200).send(imageHtml);
});

export default router;
