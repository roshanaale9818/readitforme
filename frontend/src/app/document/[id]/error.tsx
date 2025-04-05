"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-destructive mb-6">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        We encountered an error while loading your document. This might be due
        to a network issue or the document may not exist.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => (window.location.href = "/")} variant="outline">
          Go Home
        </Button>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
