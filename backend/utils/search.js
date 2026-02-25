import fs from "fs";
import cosineSimilarity from "compute-cosine-similarity";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Load vector store
const vectorStore = JSON.parse(
  fs.readFileSync("./data/vector_store.json", "utf-8")
);

export async function search(query) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query
  });

  const queryVector = response.data[0].embedding;

  const results = vectorStore.map(item => ({
    ...item,
    score: cosineSimilarity(queryVector, item.vector)
  }));

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 3);
}