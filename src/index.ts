import express, { Request, Response } from "express";
import connectDB from "./data/DbMongo";


import config from "./config/config";


import TestRoute from "./routes/TestRoute";
import AdminRoute from "./routes/AdminRoute"
import imageRoute from "./routes/IOT"
import FrontendDataRoute from './routes/FrontendDataRoute'
import { NotificationService } from "./services/NotificationService";
import NotificationRoute from "./routes/NotificationRoute";
import { VerificationService } from "./services/VerificationService";
import { StatistiqueService } from "./services/StatistiqueService";
import { categorieAnalyser } from "./model/Statistique";
import { categorieJeter } from "./model/Verification";
import createCombinedDocuments from "./services/CombinedDataDechetService";
import { categorieAnalyserDechet } from "./model/Dechet";
import { CreateDataService } from "./services/CreateDataService";




const app = express();
const port = config.port;

app.use(express.json());



app.use("/api", TestRoute)
app.use("/api", AdminRoute)
app.use("/api", imageRoute)
app.use('/api',FrontendDataRoute)
app.use('/api',NotificationRoute)
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express! Connexion sécurisée.");
});



  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
const run = async () => {
  try {
    console.log("Connexion à MongoDB...");
    await connectDB();
   
    



    console.log(config.geminiApiKey)
    console.log("MongoDB connecté avec succès!");
  } catch (error) {
    console.error("Erreur:", error);
  }
};

run();
