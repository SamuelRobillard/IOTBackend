import express, { Request, Response } from "express";
import connectDB from "./data/DbMongo";


import config from "./config/config";



import TestRoute from "./routes/TestRoute";




const app = express();
const port = config.port;

app.use(express.json());



app.use(TestRoute)


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
    console.log("MongoDB connecté avec succès!");
  } catch (error) {
    console.error("Erreur:", error);
  }
};

run();
