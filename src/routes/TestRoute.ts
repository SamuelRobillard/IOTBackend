import { randomInt } from "crypto";
import { Router } from "express";
import { Request, Response } from "express";

const router = Router();
//route de test juste pour avoir une reponse
router.get("/test", (req : Request, res: Response) => {
    const possibleAnswers = ["Poubelle", "Recyclage", "Composte"];
    const randomNumber = randomInt(0,3)

    res.status(200).json({message: possibleAnswers[randomNumber]});
})

export default router