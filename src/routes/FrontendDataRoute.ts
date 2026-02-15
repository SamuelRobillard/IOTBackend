import { Router } from "express";
import { DechetService } from "../services/DechetService";
import { FrontendDataController } from "../controller/FrontendDataController";

const router =  Router();

const frontendController = new FrontendDataController(); 

/**
 * @swagger
 * /api/dechets:
 *   get:
 *     summary: Obtenir tous les déchets
 *     description: Récupère la liste de tous les déchets analysés avec leurs informations
 *     tags: [Frontend Data]
 *     responses:
 *       200:
 *         description: Liste des déchets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DTODechet'
 *             example:
 *               - idDechet: "69811c3c56f92ad6ecaf8fa4"
 *                 categorieAnalyser: "recyclage"
 *                 categorieJeter: "recyclage"
 *                 date: "2028-10-23"
 *               - idDechet: "69811c3c56f92ad6ecaf8fa5"
 *                 categorieAnalyser: "compost"
 *                 categorieJeter: "compost"
 *                 date: "2028-10-22"
 *               - idDechet: "69811c3c56f92ad6ecaf8fa6"
 *                 categorieAnalyser: "poubelle"
 *                 categorieJeter: "poubelle"
 *                 date: "2028-10-21"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Erreur serveur"
 *               error: "Impossible de récupérer les déchets"
 *               statusCode: 500
 */
router.get('/dechets',frontendController.getAllDechetsDTO);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Obtenir les statistiques des déchets
 *     description: Récupère les statistiques globales de tous les déchets par catégorie
 *     tags: [Frontend Data]
 *     responses:
 *       200:
 *         description: Statistiques des déchets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Statistique'
 *             example:
 *               - _id: "6980fe25737075142256239b"
 *                 categorieAnalyser: "recyclage"
 *                 ratio: 35.29
 *                 TotalNumber: 12
 *               - _id: "6980fe25737075142256239c"
 *                 categorieAnalyser: "compost"
 *                 ratio: 44.12
 *                 TotalNumber: 15
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Erreur serveur"
 *               error: "Impossible de calculer les statistiques"
 *               statusCode: 500
 */
router.get('/stats',frontendController.getAllStats);


export default router
