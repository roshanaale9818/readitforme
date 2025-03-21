"use client";

import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8"
      >
        {/* Icon Animation */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: 1,
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            scale: { type: "spring", stiffness: 260, damping: 20 },
            rotate: { duration: 1, type: "tween", ease: "easeInOut" },
          }}
        >
          <FileQuestion className="h-24 w-24 mx-auto text-muted-foreground/50" />
        </motion.div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Page Not Found
          </h1>
          <p className="mx-auto max-w-[500px] text-muted-foreground md:text-lg">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
            Let&apos;s get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="outline" size="lg" className="gap-2">
              Start Reading
            </Button>
          </Link>
        </motion.div>

        {/* Additional Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          If you believe this is a mistake, please contact our support team.
        </motion.p>
      </motion.div>
    </main>
  );
}
