import express, { Request, Response } from "express";
import fs from "fs";
import https from "https";
import path from "path";
import swaggerUi from "swagger-ui-express";
import http from "http";
import connectDB from "./data/DbMongo";
import cors, { CorsOptions } from "cors";

import config from "./config/config";
import router from "./routes/TestRoute";


import TestRoute from "./routes/TestRoute";


const win = require("./winston/winstonLogger");
const winError = require("./winston/winstonError");

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
