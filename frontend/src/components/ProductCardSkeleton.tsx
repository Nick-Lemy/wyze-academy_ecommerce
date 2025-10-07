export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 w-75 animate-pulse">
      <div className="relative flex justify-center mb-4">
        <div className="w-[200px] h-[160px] bg-gray-200 rounded"></div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-9 bg-gray-200 rounded-full w-28"></div>
      </div>
    </div>
  );
}
