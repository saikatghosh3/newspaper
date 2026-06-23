import { CategorySkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <div className="h-9 w-9 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-16 bg-slate-200 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <CategorySkeleton />
    </div>
  );
}
