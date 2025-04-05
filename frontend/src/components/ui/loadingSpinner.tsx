export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="relative flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
