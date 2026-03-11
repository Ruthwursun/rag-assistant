import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { search } from "./utils/search.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "https://rag-assistant-beta.vercel.app/"
}));
app.use(express.json());

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const results = await search(message);

    const context = results.map((r, index) =>
      `${index + 1}. ${r.title}: ${r.content}`
    ).join("\n\n");

    const completion = await openrouter.chat.completions.create({
      model: "stepfun/step-3.5-flash:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant. Answer only using the provided context. If the answer is not available in the context, say you do not have enough information."
        },
        {
          role: "user",
          content: `CONTEXT:\n${context}\n\nQUESTION:\n${message}`
        }
      ],
      temperature: 0.2,
    });

    const reply = completion.choices[0].message.content;

  res.json({
    reply,
    retrievedChunks: results.length,
    sources: results.map((r) => r.title)
});
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Something went wrong while generating the response."
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});