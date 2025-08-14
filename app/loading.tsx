import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
