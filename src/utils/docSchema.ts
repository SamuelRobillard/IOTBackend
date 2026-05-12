import fs from "fs";
import mongoose from "mongoose";


export function generateSchemaDoc() {
  let output = "# Database Schema\n\n";

  const models = mongoose.models;

  for (const modelName in models) {
    if(models[modelName]){
        const schema = models[modelName].schema.obj;
        
        output += `## Collection: ${modelName}\n\n`;
        output += "| Field | Type |\n|-------|------|\n"
            for (const field in schema) {
                const value = schema[field] as any;

                let typeName = "Unknown";
                let relation = "";

                if (typeof value === "function") {
                    typeName = value.name;
                } else if (typeof value === "object") {
                    if (value.type) {
                    typeName = value.type.name;
                    }

                    if (value.ref) {
                    relation = ` → ref: ${value.ref}`;
                    }
                }

                output += `| ${field} | ${typeName}${relation} |\n`;
                }


            }
        }

  fs.writeFileSync("schema.md", output);
}


