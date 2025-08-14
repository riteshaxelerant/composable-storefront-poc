import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">404</h1>
        <p className="text-secondary-600 mb-8">Page not found</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
          <Link href="/categories">
            <Button variant="outline">Browse Categories</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
