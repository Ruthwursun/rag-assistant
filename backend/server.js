import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { search } from "./utils/search.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Retrieve top 3 relevant chunks
    const results = await search(message);

    const context = results.map(r => r.content).join("\n\n");

    // Send to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Answer ONLY using the provided context."
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion:\n${message}`
        }
      ]
    });

    res.json({
      answer: completion.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});