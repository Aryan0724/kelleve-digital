import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[70vh]">
      <h1 className="text-9xl font-black text-primary/20 mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We couldn't find the page you're looking for. The link may be broken or the page may have been removed.
      </p>
      <Link href="/"><Button size="lg" className="font-bold">Return Home</Button></Link>
    </div>
  );
}
