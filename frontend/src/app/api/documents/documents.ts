import { connectToDatabase } from "@/lib/mongodb";
import Document from "@/models/Document";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Connect to the database
    await connectToDatabase();

    if (req.method === "GET") {
      const { id } = req.query;

      // If an ID is provided, fetch that specific document
      if (id) {
        const document = await Document.findById(id as string);
        if (!document) {
          return res.status(404).json({ message: "Document not found" });
        }
        return res.status(200).json(document);
      }

      // Otherwise, fetch all documents
      const documents = await Document.find();
      return res.status(200).json(documents);
    }

    if (req.method === "POST") {
      // Create a new document
      const document = new Document(req.body);
      await document.save();
      return res.status(201).json(document);
    }

    // Method not allowed
    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error in API route:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: "An error has occurred",
    });
  }
}
