import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.get("/test", (req : Request, res: Response) => {
    res.status(200).json({message: "Test route is working!"});
})

export default router