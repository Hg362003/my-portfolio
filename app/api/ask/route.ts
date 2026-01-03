import { NextResponse } from "next/server";

const PROJECTS = {
  projecto:
    "ProjectO is a full-stack networking and career development platform that connects students, alumni, and professionals. It enables real-time project collaboration, mentorship, alumni spotlight, referrals, and a live activity feed. The platform is built using React.js, Node.js, MongoDB, and Mailtrap.",

  onlyicanwatch:
    "OnlyICanWatch is a secure PDF viewing system that prevents downloading, printing, and copying documents. It safely renders PDFs in the browser using protected backend routes built with Node.js and Express.",

  authify:
    "Authify is a secure authentication and user access system with signup, login, JWT-based authentication, OTP email verification, and role-based authorization. It is built using Node.js, Express.js, MongoDB, and JWT.",

  ratespace:
    "RateSpace is a user review and rating platform where authenticated users can post ratings and reviews with real-time updates, spam protection, and validation. It is built using React.js, Node.js, Express.js, MongoDB, and JWT.",

  resumo:
    "Resumo is an AI-powered resume evaluation tool that analyzes resumes for structure, relevance, formatting, and keyword matching. It provides improvement suggestions using AI-based insights.",
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

export async function POST(req) {
  try {
    const { question } = await req.json();
    const answer = detectProject(question);

    // 🚫 HARD STOP — NO AI, NO HALLUCINATION
    if (!answer) {
      return NextResponse.json({
        text: "I can explain only the projects that are part of Harshit's portfolio. Please ask about ProjectO, OnlyICanWatch, Authify, RateSpace, or Resumo.",
      });
    }

    return NextResponse.json({ text: answer });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
