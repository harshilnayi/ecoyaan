export function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl flex-grow">
      {/* Header skeleton */}
      <div className="h-10 w-64 bg-gray-200 rounded-xl mb-8 animate-shimmer" />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items skeleton */}
        <div className="lg:w-2/3 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-32 rounded-xl bg-gray-200 animate-shimmer shrink-0" />
              <div className="flex-1 space-y-3 w-full">
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-shimmer" />
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-shimmer" />
                <div className="h-6 w-1/3 bg-gray-200 rounded animate-shimmer" />
              </div>
            </div>
          ))}
        </div>

        {/* Summary skeleton */}
        <div className="lg:w-1/3">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="h-7 w-40 bg-gray-200 rounded animate-shimmer" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-shimmer" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-shimmer" />
                </div>
              ))}
            </div>
            <div className="h-14 w-full bg-gray-200 rounded-xl animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
