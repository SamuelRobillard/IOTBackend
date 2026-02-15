import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AdminController } from "../controller/AdminController";
import { createRateLimiter } from "../middlewares/rateLimitMiddleware";

const router = Router();
const adminController = new AdminController();

/**
 * @swagger
 * /api/admin:
 *   post:
 *     summary: Créer un nouvel administrateur
 *     description: Crée un nouveau compte administrateur (nécessite d'être authentifié et admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *           examples:
 *             exemple1:
 *               value:
 *                 username: "newadmin"
 *                 password: "SecurePass123!"
 *                 email: "newadmin@iottricolo.com"
 *     responses:
 *       201:
 *         description: Administrateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Administrateur créé avec succès"
 *                 admin:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Erreur de validation"
 *               error: "Email déjà utilisé"
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
 *         description: Non autorisé (pas admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Accès refusé"
 *               error: "Droits administrateur requis"
 *               statusCode: 403
 */
router.post("/admin", authMiddleware, adminMiddleware, adminController.createAdmin);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Connexion administrateur
 *     description: Authentifie un administrateur et retourne un token JWT
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             exemple1:
 *               value:
 *                 username: "admin123"
 *                 password: "SecurePassword123!"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               admin:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 username: "admin123"
 *                 email: "admin@iottricolo.com"
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Authentification échouée"
 *               error: "Nom d'utilisateur ou mot de passe incorrect"
 *               statusCode: 401
 *       429:
 *         description: Trop de tentatives
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Trop de tentatives"
 *               error: "Veuillez réessayer plus tard"
 *               statusCode: 429
 */
const loginLimiter = createRateLimiter('/api/v3/login');
if (loginLimiter) router.post('/login', loginLimiter, adminController.login);

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Obtenir tous les administrateurs
 *     description: Récupère la liste de tous les administrateurs
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Liste des administrateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 username: "admin123"
 *                 email: "admin@iottricolo.com"
 *                 createdAt: "2026-02-15T10:30:00Z"
 *               - _id: "507f1f77bcf86cd799439012"
 *                 username: "admin456"
 *                 email: "admin2@iottricolo.com"
 *                 createdAt: "2026-02-14T09:20:00Z"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Erreur serveur"
 *               error: "Impossible de récupérer les administrateurs"
 *               statusCode: 500
 */
router.get('/admin', adminController.getAllAdmin);







export default router;