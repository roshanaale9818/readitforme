"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDocument, summarizeDocument, UploadResponse } from "@/lib/api";
import Link from "next/link";
// import { motion } from "framer-motion";
import { MotionButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Check,
  Download,
  Play,
  RefreshCw,
  Pause,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { toast } from "sonner";
import { buttonHoverEffect, buttonTapEffect } from "@/app/page";
import jsPDF from "jspdf";
import { useSpeechSynthesis } from "@/components/util/useSpeech";

export default function DocumentPage() {
  const params = useParams();
  const id = params?.id as string;
  const { playSummaryAudio, isPlaying } = useSpeechSynthesis();

  const [document, setDocument] = useState<UploadResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  // console.log("isPlaying", isPlaying);
  // const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const doc = await getDocument(id);
        setDocument(doc);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Error loading document.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRegenerate = async () => {
    if (!id) return;

    setIsRegenerating(true);
    try {
      const updatedDoc = await summarizeDocument(id);
      setDocument(updatedDoc);
      toast.success("Summary regenerated successfully");
    } catch (err) {
      console.error("Error regenerating summary:", err);
      toast.error("Failed to regenerate summary");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!document?.summary) return;

    try {
      const pdf = new jsPDF();
      const fileName = document.title?.trim() || "Untitled";
      const title = `${fileName} - Summary`;

      // Add title
      pdf.setFontSize(16);
      pdf.text(title, 20, 20);
      pdf.setFontSize(12);
      const splitText = pdf.splitTextToSize(document.summary, 170);
      pdf.text(splitText, 20, 30);

      // Save with promise to await completion
      await pdf.save(
        `${fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_summary.pdf`,
        { returnPromise: true }
      );

      toast.success("Summary downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download summary");
    }
  };
  const playTextToSpeech = () => {
    if (!document?.summary) return;
    playSummaryAudio(document.summary, document.title);
  };

  // const handlePlayPause = () => {
  //   if (!document?.audioUrl) return;

  //   if (!audio) {
  //     const newAudio = new Audio(document.audioUrl);
  //     setAudio(newAudio);
  //     newAudio.play();
  //     setIsPlaying(true);
  //   } else {
  //     if (isPlaying) {
  //       audio.pause();
  //     } else {
  //       audio.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-destructive text-center">{error}</div>;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/">
          <MotionButton
            size="lg"
            className="gap-2 group cursor-pointer"
            whileHover={buttonHoverEffect}
            whileTap={buttonTapEffect}
          >
            Back to Home
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </MotionButton>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Document Summary</span>
              <div className="flex items-center gap-2">
                <MotionButton
                  size="sm"
                  className="gap-2 group cursor-pointer"
                  whileHover={buttonHoverEffect}
                  whileTap={buttonTapEffect}
                  onClick={handleDownload}
                  variant="outline"
                  disabled={!document?.summary}
                >
                  <Download className="h-4 w-4" />
                  Download
                </MotionButton>

                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isRegenerating ? "animate-spin" : ""
                    }`}
                  />
                  {isRegenerating ? "Regenerating..." : "Regenerate"}
                </Button> */}

                <MotionButton
                  size="sm"
                  className="gap-2 group cursor-pointer"
                  whileHover={buttonHoverEffect}
                  whileTap={buttonTapEffect}
                  variant="outline"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isRegenerating ? "animate-spin" : ""
                    }`}
                  />
                  {isRegenerating ? "Regenerating..." : "Regenerate"}
                </MotionButton>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {document?.title && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-500" />
                <span>{document.title}</span>
              </div>
            )}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Summary</h3>
              {document?.summary ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {document.summary}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No summary available.
                </p>
              )}
            </div>
          </CardContent>

          <div className="flex justify-center pt-6 pb-4">
            <MotionButton
              whileHover={buttonHoverEffect}
              whileTap={buttonTapEffect}
              variant="outline"
              size="lg"
              onClick={playTextToSpeech}
              className="gap-3 py-6 px-8 text-lg cursor-pointer"
              disabled={!document?.summary || isRegenerating}
            >
              <div className="flex items-center gap-3">
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
                <span>{isPlaying ? "Pause Summary" : "Play Summary"}</span>
              </div>
            </MotionButton>
          </div>
        </Card>
      </div>
    </main>
  );
}
