import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt (string) required" });
    }

    // Base URL (use from env or default)
    const base = process.env.POLLINATIONS_BASE || "https://text.pollinations.ai";
    const timeout = Number(process.env.REQUEST_TIMEOUT) || 20000;

    // Prepare request
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const url = `${base}/${encodedPrompt}`;

    // Fetch from Pollinations
    const response = await axios.get(url, { timeout });

    let text = response.data;
    if (typeof text !== "string") text = JSON.stringify(text);

    // Clean text
    const reply = text.trim().replace(/^["']|["']$/g, "");

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Pollinations Error:", error.message);
    return res
      .status(500)
      .json({ error: "Pollinations request failed or timed out" });
  }
}
