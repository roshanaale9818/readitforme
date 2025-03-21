"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  FileText,
  Check,
  AlertCircle,
  Play,
  ArrowLeft,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { uploadDocument, summarizeDocument } from "@/lib/api";
import { useRouter } from "next/navigation";

const buttonHoverEffect = {
  scale: 1.02,
  transition: {
    duration: 0.2,
    ease: "easeInOut",
  },
};

const buttonTapEffect = {
  scale: 0.98,
};

const MotionButton = motion(Button);
const MotionCard = motion(Card);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function UploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDocument, setUploadedDocument] = useState<{
    _id: string;
    summary?: string;
    isSummarizing?: boolean;
  } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size too large. Maximum size is 10MB");
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Invalid file type. Only PDF, DOCX, and TXT files are allowed");
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    setFileName(file.name);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const response = await uploadDocument(file);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedDocument(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload document"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSummarize = async () => {
    console.log(uploadedDocument);
    if (!uploadedDocument?._id) return;

    try {
      setUploadedDocument((prev) =>
        prev ? { ...prev, isSummarizing: true } : null
      );
      const response = await summarizeDocument(uploadedDocument._id);
      setUploadedDocument((prev) =>
        prev
          ? { ...prev, summary: response.summary, isSummarizing: false }
          : null
      );
      router.push(`/document/${uploadedDocument._id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate summary"
      );
      setUploadedDocument((prev) =>
        prev ? { ...prev, isSummarizing: false } : null
      );
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/">
          <MotionButton
            variant="ghost"
            className="gap-2 group cursor-pointer"
            whileHover={buttonHoverEffect}
            whileTap={buttonTapEffect}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 " />
            Back to Home
          </MotionButton>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-[1fr,400px]">
        {/* Left Column - Main Upload Area */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Upload Document
            </h1>
            <p className="text-muted-foreground">
              Transform your document into an audio summary in just a few
              clicks.
            </p>
          </div>

          <MotionCard>
            <CardContent className="pt-6">
              {!isUploading && !uploadedDocument && (
                <motion.div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4"
                  whileHover={{
                    scale: 1.01,
                    borderColor: "hsl(var(--primary))",
                  }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.2 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      Upload your document
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your PDF or document here, or click to
                      browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports PDF, TXT, DOCX (max 10MB)
                    </p>
                  </div>

                  <MotionButton
                    variant="outline"
                    className="relative overflow-hidden group"
                    whileHover={buttonHoverEffect}
                    whileTap={buttonTapEffect}
                  >
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.txt,.docx"
                      onChange={handleFileChange}
                    />
                    <Upload className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Choose File
                  </MotionButton>
                </motion.div>
              )}

              {/* Processing States */}
              <div className="mt-6 space-y-4">
                {/* Upload Progress */}
                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="relative w-16 h-16"
                      >
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                        <div
                          className="absolute inset-0 border-4 border-primary rounded-full"
                          style={{
                            clipPath: `polygon(0 0, 100% 0, 100% ${uploadProgress}%, 0 ${uploadProgress}%)`,
                          }}
                        />
                      </motion.div>
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold">
                          Processing Document
                        </h3>
                        {fileName && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                          >
                            <FileText className="h-4 w-4" />
                            <span
                              className="max-w-[200px] truncate"
                              title={fileName}
                            >
                              {fileName}
                            </span>
                          </motion.div>
                        )}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Progress
                            </span>
                            <span className="font-medium">
                              {uploadProgress}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-primary"
                              initial={{ width: "0%" }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Success State with Summarize/Play Button */}
                {uploadedDocument && !error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-green-500">
                        <Check className="h-4 w-4" />
                        <span>Document processed successfully!</span>
                      </div>
                      {fileName && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <FileText className="h-4 w-4" />
                          <span
                            className="max-w-[200px] truncate"
                            title={fileName}
                          >
                            {fileName}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    <MotionButton
                      className="w-full gap-2 group bg-primary hover:bg-primary/90"
                      size="lg"
                      whileHover={buttonHoverEffect}
                      whileTap={buttonTapEffect}
                      onClick={handleSummarize}
                      disabled={uploadedDocument.isSummarizing}
                    >
                      {uploadedDocument.isSummarizing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Summarizing...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
                          Generate Summary
                        </>
                      )}
                    </MotionButton>
                  </motion.div>
                )}

                {/* Error State */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-destructive/10 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </MotionCard>
        </div>

        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Processing Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Document Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your document structure and content.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">2. Smart Summarization</h4>
                <p className="text-sm text-muted-foreground">
                  Key points and main ideas are extracted and organized.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">3. Voice Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Natural-sounding voice narrates your summary.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-1 text-green-500" />
                  Ensure documents are text-searchable PDFs
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-1 text-green-500" />
                  Clear formatting improves summary quality
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-1 text-green-500" />
                  Files should be under 10MB for best results
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
