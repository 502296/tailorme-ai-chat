// api/chat.js

import OpenAI from "openai";



// غيّر هذا لاحقًا إلى https://tailorme.me لزيادة الأمان

const ALLOW_ORIGIN = "*";



const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });



// موديل اقتصادي مع تصعيد تلقائي لو الرسالة طويلة

function pickModel(text = "") {

  const tooLong = text.length > 1200;

  return tooLong ? "gpt-4o" : "gpt-4o-mini";

}



export default async function handler(req, res) {

  // CORS

  res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();



  if (req.method !== "POST") {

    res.setHeader("Allow", "POST, OPTIONS");

    return res.status(405).json({ error: "Method not allowed" });

  }



  try {

    const { history = [], userText = "" } = req.body || {};

    const model = pickModel(userText);



    const systemPrompt = `

You are TailorMe Assistant.

- Detect the user's language and always reply in the SAME language (Arabic / English / Spanish).

- Be concise, friendly, and practical.

- If the question is about TailorMe (alterations, pickup & delivery, working hours, example pricing), answer directly with short bullets.

- If out of scope, answer briefly then offer to connect to human support.

- Never invent exact prices; if unsure, ask for number of items and turnaround time.

`;



    const completion = await client.chat.completions.create({

      model,

      temperature: 0.4,

      max_tokens: 600,

      messages: [

        { role: "system", content: systemPrompt.trim() },

        ...history,                 // [{role:"user"/"assistant", content:"..."}]

        { role: "user", content: userText }

      ]

    });



    const reply = completion.choices?.[0]?.message?.content || "";

    res.status(200).json({ reply, model });

  } catch (err) {

    console.error(err);

    res.status(500).json({ error: "AI error, please try again" });

  }

}
