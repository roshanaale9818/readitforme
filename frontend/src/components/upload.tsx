"use client";

import { useState } from "react";
import axios from "axios";

const UploadPage = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAudioFile(e.target.files[0]);
    }
  };

  // Handle form submission to send file to the backend
  const handleSubmit = async () => {
    if (audioFile) {
      setIsLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("audio", audioFile);

      try {
        const response = await axios.post("/api/ai/summarize", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setSummary(response.data.summary); // Set the AI-generated summary
      } catch (err) {
        setError("Failed to summarize the audio. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please upload an audio file.");
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Audio to Summarize</h1>

      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={isLoading}
      />

      <button onClick={handleSubmit} disabled={isLoading || !audioFile}>
        {isLoading ? "Summarizing..." : "Summarize"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {summary && (
        <p>
          <strong>Summary:</strong> {summary}
        </p>
      )}
    </div>
  );
};

export default UploadPage;
