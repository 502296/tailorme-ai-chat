// /api/chat.js

import OpenAI from "openai";



export default async function handler(req, res) {

  if (req.method !== "POST") {

    res.status(405).json({ error: "Method not allowed" });

    return;

  }



  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {

    res.status(500).json({ error: "Missing OPENAI_API_KEY on Vercel" });

    return;

  }



  const { message, name } = req.body || {};

  if (!message || typeof message !== "string") {

    res.status(400).json({ error: "Missing message" });

    return;

  }



  const openai = new OpenAI({ apiKey });



  const system = [

    "You are TailorMe's helpful assistant for a tailoring/alterations shop.",

    "Be concise, friendly, and practical.",

    "If user writes in a language, reply in the SAME language; otherwise reply in English.",

    "For prices, give typical ranges and kindly suggest visiting the shop for an exact quote.",

    "Business hours: Mon–Sat 10am–7pm, Sun closed. (Edit if needed)"

  ].join(" ");



  const prefix = name ? `Customer name: ${name}. ` : "";



  try {

    const completion = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [

        { role: "system", content: system },

        { role: "user", content: prefix + message }

      ],

      temperature: 0.3,

      max_tokens: 400

    });



    const reply = completion.choices?.[0]?.message?.content?.trim();

    res.status(200).json({ reply });

  } catch (err) {

    console.error(err);

    res.status(500).json({ error: err.message || "OpenAI request failed" });

  }

}
