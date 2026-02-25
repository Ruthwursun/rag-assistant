import fs from "fs";
import dotenv from "dotenv";
import OpenAI from "openai";
import { chunkText } from "../utils/chunk.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const docs = JSON.parse(fs.readFileSync("./data/docs.json", "utf-8"));

async function run() {
  const vectorStore = [];

  for (let doc of docs) {
    const chunks = chunkText(doc.content);

    for (let chunk of chunks) {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk
      });

      vectorStore.push({
        id: doc.id,
        title: doc.title,
        content: chunk,
        vector: response.data[0].embedding
      });
    }
  }

  fs.writeFileSync(
    "./data/vector_store.json",
    JSON.stringify(vectorStore, null, 2)
  );

  console.log("Embeddings saved to vector_store.json");
}

run();