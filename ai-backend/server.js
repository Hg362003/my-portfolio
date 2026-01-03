require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log("OPENROUTER API KEY LOADED:", !!process.env.OPENROUTER_API_KEY);

const PROJECTS = {
  projecto: {
    name: "ProjectO",
    description:
      "ProjectO is a full-stack networking and career development platform that connects students, alumni, and professionals. It supports real-time project collaboration, mentorship, alumni spotlight, referrals, and a live activity feed.",
    tech: "React.js, Node.js, MongoDB, Mailtrap",
  },

  onlyicanwatch: {
    name: "OnlyICanWatch",
    description:
      "OnlyICanWatch is a secure PDF viewing system that prevents downloading, printing, and copying documents. It renders PDFs safely in the browser using protected backend routes.",
    tech: "Node.js, Express.js, PDF.js",
  },

  authify: {
    name: "Authify",
    description:
      "Authify is a secure authentication and user access system with signup, login, JWT authentication, OTP email verification, and role-based authorization.",
    tech: "Node.js, Express.js, MongoDB, JWT, Bcrypt, Nodemailer",
  },

  ratespace: {
    name: "RateSpace",
    description:
      "RateSpace is a user review and rating platform where authenticated users can post ratings and reviews with real-time updates, spam control, and validation.",
    tech: "React.js, Node.js, Express.js, MongoDB, JWT",
  },

  resumo: {
    name: "Resumo",
    description:
      "Resumo is an AI-powered resume evaluation tool that analyzes resumes for clarity, relevance, formatting, and keyword matching, and provides improvement suggestions.",
    tech: "Node.js, Express.js, OpenAI API",
  },
};

function detectProject(question) {
  const q = question.toLowerCase();

  if (q.includes("projecto")) return PROJECTS.projecto;
  if (q.includes("onlyicanwatch")) return PROJECTS.onlyicanwatch;
  if (q.includes("authify")) return PROJECTS.authify;
  if (q.includes("ratespace")) return PROJECTS.ratespace;
  if (q.includes("resumo")) return PROJECTS.resumo;

  return null;
}

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "OpenRouter API key is not configured" });
    }

    console.log("Using OpenRouter model: mistralai/mistral-7b-instruct");
    console.log("Sending to OpenRouter:", question);

    // Detect which project is being asked about
    const project = detectProject(question);

    if (!project) {
      return res.json({
        text: "I can explain only the projects that are part of Harshit's portfolio. Please ask about ProjectO, Authify, OnlyICanWatch, RateSpace, or Resumo.",
      });
    }

    const systemPrompt = `
You are Harshit's AI portfolio assistant.
Explain ONLY the project provided below.
Do NOT invent features.
Do NOT assume anything.

Project Name: ${project.name}
Description: ${project.description}
Tech Stack: ${project.tech}

Explain this clearly in 3–4 sentences.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Harshit Portfolio AI",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: question,
            },
          ],
          temperature: 0.2,
          max_tokens: 180,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", response.status, errorText);
      // Always return 500 with generic message, regardless of OpenRouter status
      return res.status(500).json({
        error: "AI service is temporarily unavailable. Please try again.",
      });
    }

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({
        error: "AI service is temporarily unavailable. Please try again.",
      });
    }

    const text = data.choices[0].message.content;
    
    console.log("OpenRouter response received:", text);
    
    res.json({ text });
  } catch (error) {
    console.error("OpenRouter error:", error);
    return res.status(500).json({
      error: "AI service is temporarily unavailable. Please try again.",
    });
  }
});

app.listen(3001, () => {
  console.log("AI Backend running on http://localhost:3001");
});
