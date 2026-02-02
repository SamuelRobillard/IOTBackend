import express, { Request, Response } from "express";
import connectDB from "./data/DbMongo";


import config from "./config/config";



import TestRoute from "./routes/TestRoute";
import AdminRoute from "./routes/AdminRoute"




const app = express();
const port = config.port;

app.use(express.json());



app.use("/api", TestRoute)
app.use("/api", AdminRoute)

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
