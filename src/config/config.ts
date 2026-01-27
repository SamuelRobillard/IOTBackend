import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Détecter l'environnement
const env = process.env.NODE_ENV || "development";

// Charger le fichier .env uniquement en local
if (!process.env.RENDER) {
  dotenv.config({ path: path.resolve(`./src/config/env/${env}.env`) });
}

// Déterminer le chemin vers settings.json
// __dirname = dist/config/ en prod, src/config/ en dev
const settingsPath = path.resolve(__dirname, "settings.json");

type Settings = {
  redirectHttpToHttps?: boolean;
  httpsPort?: number;
  httpPort?: number;
  allowedOrigins?: string[];
  rateLimit?: any;
};


let settings: Settings = {};
try {
  settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
} catch (err) {
  console.warn("⚠️ settings.json non trouvé ou invalide.");
}

const config = {
  env,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  port: process.env.PORT || 3000,
  mongoUri: process.env.DB_URI || "",
  redirectHttpToHttps: settings.redirectHttpToHttps || false,
  httpsPort: settings.httpsPort || 443,
  httpPort: settings.httpPort || 80,
  allowedOrigins: settings.allowedOrigins || [],
  rateLimitSettings: settings.rateLimit || {}
};


export default config;
