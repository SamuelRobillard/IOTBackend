import express, { Request, Response } from 'express';
import multer from 'multer';
import { ImageController } from '../controller/ImageController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { NotificationsController } from '../controller/NotificationController';



const router = express.Router();


const storage = multer.memoryStorage();
const notificationsController = new NotificationsController();

/**
 * @swagger
 * /api/notif:
 *   get:
 *     summary: Obtenir toutes les notifications
 *     description: Récupère la liste de toutes les notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Liste des notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 categoriePoubelle: "recyclage"
 *                 idAdmin: "507f1f77bcf86cd799439012"
 *                 isFull: true
 *                 notifIsSent: false
 *                 createdAt: "2026-02-15T10:30:00Z"
 *               - _id: "507f1f77bcf86cd799439013"
 *                 categoriePoubelle: "compost"
 *                 idAdmin: "507f1f77bcf86cd799439012"
 *                 isFull: false
 *                 notifIsSent: true
 *                 createdAt: "2026-02-14T09:20:00Z"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Erreur serveur"
 *               error: "Impossible de récupérer les notifications"
 *               statusCode: 500
 */
router.get('/notif', notificationsController.getAllNotifs);

/**
 * @swagger
 * /api/notif:
 *   post:
 *     summary: Créer une nouvelle notification
 *     description: Crée une nouvelle notification pour une poubelle
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *           examples:
 *             poubellePleine:
 *               summary: Poubelle pleine
 *               value:
 *                 categoriePoubelle: "recyclage"
 *                 idAdmin: "507f1f77bcf86cd799439012"
 *                 isFull: true
 *                 notifIsSent: false
 *             poubelleVide:
 *               summary: Poubelle vidée
 *               value:
 *                 categoriePoubelle: "compost"
 *                 idAdmin: "507f1f77bcf86cd799439012"
 *                 isFull: false
 *                 notifIsSent: true
 *     responses:
 *       201:
 *         description: Notification créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification créée avec succès"
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 *             example:
 *               message: "Notification créée avec succès"
 *               notification:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 categoriePoubelle: "recyclage"
 *                 idAdmin: "507f1f77bcf86cd799439012"
 *                 isFull: true
 *                 notifIsSent: false
 *                 createdAt: "2026-02-15T10:30:00Z"
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Erreur de validation"
 *               error: "Tous les champs sont requis"
 *               statusCode: 400
 */
router.post('/notif', notificationsController.createNotif);

/**
 * @swagger
 * /api/notif/{categoriePoubelle}:
 *   post:
 *     summary: Mettre à jour une notification
 *     description: Met à jour le statut d'une notification pour une catégorie de poubelle spécifique
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: categoriePoubelle
 *         required: true
 *         schema:
 *           type: string
 *           enum: [compost, recyclage, poubelle, autre]
 *         description: Catégorie de la poubelle
 *         examples:
 *           recyclage:
 *             value: "recyclage"
 *             summary: Mise à jour notification recyclage
 *           compost:
 *             value: "compost"
 *             summary: Mise à jour notification compost
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *           examples:
 *             marquerEnvoyee:
 *               summary: Marquer comme envoyée
 *               value:
 *                 notifIsSent: true
 *             marquerPleine:
 *               summary: Marquer poubelle pleine
 *               value:
 *                 isFull: true
 *                 notifIsSent: false
 *     responses:
 *       200:
 *         description: Notification mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification mise à jour"
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 *             example:
 *               message: "Notification mise à jour"
 *               notification:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 categoriePoubelle: "recyclage"
 *                 isFull: false
 *                 notifIsSent: true
 *                 updatedAt: "2026-02-15T11:00:00Z"
 *       404:
 *         description: Notification non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Notification non trouvée"
 *               error: "Aucune notification pour cette catégorie"
 *               statusCode: 404
 */
router.post('/notif/:categoriePoubelle', notificationsController.updateNotif);

export default router;
