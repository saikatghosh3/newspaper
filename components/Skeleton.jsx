export function SkeletonBox({ className = '' }) {
  return <div className={`bg-slate-200 rounded-md animate-pulse ${className}`} />;
}

export function SkeletonLine({ width = '100%', className = '' }) {
  return <div className={`h-4 bg-slate-200 rounded animate-pulse ${className}`} style={{ width }} />;
}

export function HomepageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200 rounded-md overflow-hidden mb-10">
          <SkeletonBox className="lg:col-span-7 h-80 lg:h-[420px]" />
          <div className="lg:col-span-5 p-6 lg:p-8 space-y-4">
            <SkeletonBox className="h-4 w-20" />
            <SkeletonBox className="h-10 w-full" />
            <SkeletonBox className="h-10 w-3/4" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-2/3" />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9 space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <SkeletonBox className="w-1.5 h-8" />
                    <SkeletonBox className="h-6 w-40" />
                  </div>
                  <SkeletonBox className="h-4 w-16" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <SkeletonBox className="lg:col-span-6 h-72" />
                  <div className="lg:col-span-3 space-y-4">
                    <SkeletonBox className="h-52" />
                    <SkeletonBox className="h-52" />
                    <SkeletonBox className="h-52" />
                  </div>
                  <div className="lg:col-span-3 space-y-3 p-4 bg-slate-100 rounded-md">
                    <SkeletonBox className="h-4 w-3/4" />
                    <SkeletonBox className="h-4 w-full" />
                    <SkeletonBox className="h-4 w-2/3" />
                    <SkeletonBox className="h-4 w-full" />
                    <SkeletonBox className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="lg:col-span-3 mt-12 lg:mt-0 space-y-6">
            <SkeletonBox className="h-64" />
          </aside>
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <SkeletonBox className="h-4 w-24 mb-8" />
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9 space-y-6">
            <SkeletonBox className="h-6 w-32" />
            <SkeletonBox className="h-12 w-full" />
            <SkeletonBox className="h-12 w-3/4" />
            <div className="flex gap-4">
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-4 w-16" />
            </div>
            <SkeletonBox className="h-96 w-full rounded-lg" />
            <div className="space-y-3">
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-3/4" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-5/6" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-2/3" />
            </div>
          </div>
          <aside className="lg:col-span-3 mt-12 lg:mt-0">
            <SkeletonBox className="h-64" />
        </aside>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <SkeletonBox className="h-4 w-24 mb-6" />
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <SkeletonBox className="h-40 w-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white border border-slate-200 rounded-md overflow-hidden">
                  <SkeletonBox className="h-48 w-full rounded-none" />
                  <div className="p-4 space-y-3">
                    <SkeletonBox className="h-4 w-3/4" />
                    <SkeletonBox className="h-4 w-full" />
                    <SkeletonBox className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-3 mt-12 lg:mt-0">
            <SkeletonBox className="h-64" />
        </aside>
      </div>
    </div>
  );
}
