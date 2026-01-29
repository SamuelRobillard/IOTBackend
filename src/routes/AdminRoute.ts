import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AdminController } from "../controller/AdminController";
import { createRateLimiter } from "../middlewares/rateLimitMiddleware";

const router = Router();
const adminController = new AdminController();


router.post("/admin", authMiddleware, adminMiddleware, adminController.createAdmin);

const loginLimiter = createRateLimiter('/api/v3/login');
if (loginLimiter) router.post('/login', loginLimiter, adminController.login);

router.get('/users', adminController.getAllAdmin);







export default router;