import { Router } from "express";
import { DechetService } from "../services/DechetService";
import { FrontendDataController } from "../controller/FrontendDataController";

const router =  Router();

const frontendController = new FrontendDataController(); 

router.get('/dechets',frontendController.getAllDechetsDTO);
router.get('/stats',frontendController.getAllStats);


export default router
