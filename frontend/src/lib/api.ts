import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100",
  withCredentials: true,
});

export interface UploadResponse {
  _id: string;
  title: string;
  content: string;
  fileType: string;
  isProcessed: boolean;
  summary?: string;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export async function uploadDocument(
  file: File,
  title?: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (title) {
    formData.append("title", title);
  }

  try {
    const response = await api.post<UploadResponse>(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error(
          error.response.data.message || "Invalid file format or size"
        );
      }
      if (error.response?.status === 413) {
        throw new Error("File size too large. Maximum size is 10MB");
      }
    }
    throw new Error("Failed to upload document. Please try again.");
  }
}

export async function summarizeDocument(id: string): Promise<UploadResponse> {
  try {
    const response = await api.post<UploadResponse>(
      `/documents/${id}/summarize`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to generate summary"
      );
    }
    throw new Error("Failed to generate summary. Please try again.");
  }
}

// ...existing code...

export async function getDocument(
  id: string | undefined
): Promise<UploadResponse> {
  if (!id) {
    throw new Error("Document ID is required");
  }
  try {
    const response = await api.get<UploadResponse>(`/documents/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Document not found");
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch document"
      );
    }
    throw new Error("Failed to fetch document. Please try again.");
  }
}
