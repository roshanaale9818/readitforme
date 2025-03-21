import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const audioText = req.body.audioText; // You may want to add logic for speech-to-text here
    const response = await axios.post("http://localhost:4000/ai/summarize", {
      audioText,
    });
    res.status(200).json({ summary: response.data });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
