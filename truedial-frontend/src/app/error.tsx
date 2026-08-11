'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('TrueDial Global Error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[70vh]">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We experienced an unexpected error on our end. Our engineering team has been notified.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => reset()} variant="default">Try again</Button>
        <Link href="/"><Button variant="outline">Return Home</Button></Link>
      </div>
    </div>
  );
}
