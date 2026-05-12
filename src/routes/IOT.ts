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

/**
 * @swagger
 * /api/upload-image:
 *   post:
 *     summary: Analyser une image de déchet
 *     description: Upload et analyse une image pour déterminer la catégorie du déchet (nécessite authentification admin)
 *     tags: [IOT]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image du déchet (max 10MB)
 *           examples:
 *             exemple1:
 *               summary: Upload d'une image
 *               value:
 *                 image: (fichier binaire)
 *     responses:
 *       200:
 *         description: Image analysée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadImageResponse'
 *             example:
 *               message: "Image analysée avec succès"
 *               categorie: "recyclage"
 *               dechetId: "507f1f77bcf86cd799439011"
 *       400:
 *         description: Image manquante ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Erreur de validation"
 *               error: "Image requise"
 *               statusCode: 400
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Authentification requise"
 *               error: "Token manquant ou invalide"
 *               statusCode: 401
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Accès refusé"
 *               error: "Droits administrateur requis"
 *               statusCode: 403
 *       413:
 *         description: Fichier trop volumineux
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Fichier trop volumineux"
 *               error: "La taille maximale est de 10MB"
 *               statusCode: 413
 */
router.post('/upload-image', upload.single('image'), authMiddleware, adminMiddleware, imageController.uploadImage);

/**
 * @swagger
 * /api/jeter/{categorieJeter}:
 *   post:
 *     summary: Vérifier le jet d'un déchet
 *     description: Vérifie et enregistre le jet d'un déchet dans une catégorie spécifique
 *     tags: [IOT]
 *     parameters:
 *       - in: path
 *         name: categorieJeter
 *         required: true
 *         schema:
 *           type: string
 *           enum: [compost, recyclage, poubelle, autre]
 *         description: Catégorie de la poubelle où le déchet est jeté
 *         examples:
 *           recyclage:
 *             value: "recyclage"
 *             summary: Jet dans la poubelle de recyclage
 *           compost:
 *             value: "compost"
 *             summary: Jet dans la poubelle de compost
 *     responses:
 *       200:
 *         description: Jet vérifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Déchet jeté correctement"
 *                 categorie:
 *                   type: string
 *                   example: "recyclage"
 *                 verification:
 *                   type: object
 *                   properties:
 *                     correct:
 *                       type: boolean
 *                       example: true
 *             example:
 *               message: "Déchet jeté correctement"
 *               categorie: "recyclage"
 *               verification:
 *                 correct: true
 *       400:
 *         description: Catégorie invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Catégorie invalide"
 *               error: "La catégorie doit être: compost, recyclage, poubelle ou autre"
 *               statusCode: 400
 *       404:
 *         description: Aucun déchet récent à vérifier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Aucun déchet trouvé"
 *               error: "Veuillez d'abord analyser une image"
 *               statusCode: 404
 */
router.post('/jeter/:categorieJeter',iOTController.verificationJeter);

export default router;
