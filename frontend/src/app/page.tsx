"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, FileText, Wand2, Speaker } from "lucide-react";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

export const buttonHoverEffect = {
  scale: 1.02,
  transition: {
    duration: 0.2,
    ease: "easeInOut",
  },
};

export const buttonTapEffect = {
  scale: 0.98,
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-muted">
      <div className="container max-w-6xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Read It for Me
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Let AI read and summarize your documents. Transform PDFs, articles,
            and long texts into concise audio summaries. Save time and absorb
            information effortlessly.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/upload">
              <MotionButton
                size="lg"
                className="gap-2 group cursor-pointer"
                whileHover={buttonHoverEffect}
                whileTap={buttonTapEffect}
              >
                Start Reading
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MotionButton>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-8">
          <Card className="cursor-pointer">
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Multiple Document Types</CardTitle>
              <CardDescription>
                Support for PDFs, articles, blogs, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              Upload any text document and let our AI create a clear, concise
              summary ready to be read aloud.
            </CardContent>
          </Card>

          <Card className="cursor-pointer">
            <CardHeader>
              <Speaker className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Natural Voice</CardTitle>
              <CardDescription>
                Crystal clear text-to-speech with natural intonation
              </CardDescription>
            </CardHeader>
            <CardContent>
              Listen to your summaries with high-quality, human-like voice that
              makes comprehension effortless.
            </CardContent>
          </Card>

          <Card className="cursor-pointer sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <Wand2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Smart Summarization</CardTitle>
              <CardDescription>AI-powered content analysis</CardDescription>
            </CardHeader>
            <CardContent>
              Our AI extracts key points and main ideas, creating perfect
              summaries that capture the essence of your content.
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
