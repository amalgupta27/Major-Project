import OpenAI from "openai";
import axios from "axios";
import { findCulturalFact } from "../data/culturalDataset.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

/* Load statesData.js as JSON */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const statesDataPath = path.join(
  __dirname,
  "..",
  "..",
  "cultural-wonders",
  "src",
  "data",
  "statesData.js"
);

let statesData = [];
try {
  const fileContent = fs.readFileSync(statesDataPath, "utf-8");
  const match = fileContent.match(/export const statesData = (\[.*?\]);/s);
  if (match) {
    statesData = eval(match[1]);
  }
} catch (e) {
  console.warn("Could not load statesData.js:", e.message);
}

/* Initialize OpenAI */
let openai = null;
if (
  process.env.OPENAI_API_KEY &&
  process.env.OPENAI_API_KEY !== "your_openai_api_key_here"
) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/* ================== PROMPTS ================== */

const SYSTEM_PROMPT = `You are a knowledgeable cultural heritage guide specializing in Indian culture, traditions, arts, crafts, festivals, and historical monuments. 
Keep answers short, friendly, and informative (2-3 paragraphs).`;

const HINT_PROMPT = `You are a quiz assistant for Indian culture. Give a small hint, NOT the answer. Max 2 lines.`;

const STORYTELLING_PROMPT = `You are a storyteller for Indian culture. Create an engaging cultural story in 3-4 paragraphs.`;

const TRAVEL_GUIDE_PROMPT = `You are a travel guide for Indian cultural tourism. Provide a day-wise (3-5 days) itinerary.`;

const HISTORICAL_PERSPECTIVE_PROMPT = `You are describing Indian culture from 200 years ago. Keep it historical and immersive.`;

const SEARCH_PROMPT = `You are a cultural search assistant. Provide relevant Indian cultural suggestions.`;

/* ================== OPENAI CHAT ================== */

async function chatWithOpenAI(message, conversationHistory = []) {
  if (!openai) {
    throw new Error(
      "OpenAI API key not configured. Please add it in backend/.env"
    );
  }

  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10),
      { role: "user", content: message },
    ];

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: messages,
      max_output_tokens: 500,
    });

    return response.output_text.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    throw new Error(`OpenAI failed: ${error.message}`);
  }
}

/* ================== HUGGING FACE ================== */

async function chatWithHuggingFace(message, conversationHistory = []) {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) throw new Error("HuggingFace API key not found");

    const model = "microsoft/DialoGPT-medium";
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;

    const context = conversationHistory
      .slice(-5)
      .map(
        (msg) =>
          `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const inputText = context
      ? `${context}\nHuman: ${message}\nAssistant:`
      : `Human: ${message}\nAssistant:`;

    const response = await axios.post(
      apiUrl,
      {
        inputs: inputText,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          do_sample: true,
          pad_token_id: 50256,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    if (response.data?.generated_text) {
      const generatedText = response.data.generated_text;
      return generatedText.split("Assistant:").pop().trim();
    }

    throw new Error("No response from HF model");
  } catch (error) {
    console.error("HuggingFace Error:", error.message);
    throw new Error(`HuggingFace failed: ${error.message}`);
  }
}

/* ================== MAIN CHAT FUNCTION ================== */

export async function chatWithAI(message, conversationHistory = []) {
  console.log("\n=== NEW CHAT REQUEST ===");
  console.log("Message:", message);

  /* 1. Check cultural dataset */
  const culturalFact = findCulturalFact(message);
  if (culturalFact) {
    console.log("✅ From cultural dataset");
    return culturalFact.answer;
  }

  /* 2. Check States info */
  const normalizedMsg = message.toLowerCase();
  for (const state of statesData) {
    if (normalizedMsg.includes(state.name?.toLowerCase())) {
      return `Here's some information about ${state.name}:\n${state.intro}`;
    }
  }

  /* 3. Try OpenAI */
  if (
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== "your_openai_api_key_here"
  ) {
    try {
      console.log("🚀 Using OpenAI...");
      return await chatWithOpenAI(message, conversationHistory);
    } catch (err) {
      console.warn("OpenAI failed, trying HuggingFace...");
    }
  }

  /* 4. Try HuggingFace */
  if (
    process.env.HUGGINGFACE_API_KEY &&
    process.env.HUGGINGFACE_API_KEY !== "your_huggingface_api_key_here"
  ) {
    try {
      console.log("🚀 Using HuggingFace...");
      return await chatWithHuggingFace(message, conversationHistory);
    } catch (err) {
      console.warn("HuggingFace also failed...");
    }
  }

  /* 5. Fallback */
  return `⚠️ AI service not configured.

Please add your OpenAI API key in:
backend/.env

Example:
OPENAI_API_KEY=sk-xxxxxxx

Then restart:
npm run dev

Try asking:
"Tell me about Kathakali" or "Famous monuments of India"`;
}

/* ================== EXTRA FEATURES ================== */

export async function getQuizHint(question, options = []) {
  const prompt = `${HINT_PROMPT}\n\nQuestion: ${question}\nOptions: ${options.join(
    ", "
  )}`;
  return await chatWithAI(prompt, []);
}

export async function generateCulturalStory(topic, context = "") {
  const prompt = `${STORYTELLING_PROMPT}\n\nTopic: ${topic}\nContext: ${context}`;
  return await chatWithAI(prompt, []);
}

export async function generateTravelItinerary(state, duration = 5) {
  const prompt = `${TRAVEL_GUIDE_PROMPT}\n\nCreate a ${duration}-day plan for ${state}`;
  return await chatWithAI(prompt, []);
}

export async function generateHistoricalPerspective(tradition, context = "") {
  const prompt = `${HISTORICAL_PERSPECTIVE_PROMPT}\n\nTradition: ${tradition}\nContext: ${context}`;
  return await chatWithAI(prompt, []);
}

export async function performCulturalSearch(query) {
  const prompt = `${SEARCH_PROMPT}\n\nUser Query: ${query}`;
  return await chatWithAI(prompt, []);
}

/* ================== STATUS ================== */

export function getAIServicesStatus() {
  const openaiAvailable =
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== "your_openai_api_key_here";

  const huggingfaceAvailable =
    process.env.HUGGINGFACE_API_KEY &&
    process.env.HUGGINGFACE_API_KEY !== "your_huggingface_api_key_here";

  return {
    openai: openaiAvailable,
    huggingface: huggingfaceAvailable,
    primary: openaiAvailable
      ? "openai"
      : huggingfaceAvailable
      ? "huggingface"
      : "none",
  };
}
