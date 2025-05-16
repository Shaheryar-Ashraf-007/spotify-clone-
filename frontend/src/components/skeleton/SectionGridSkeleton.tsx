
const SectionGridSkeleton = () => {
  return (
    <div className="mb-8">
        <div className="h-8 w-48 bg-zinc-800 rounded-md animate-pulse mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-zinc-800/40 rounded-md p-4 animate-pulse">
                        <div className="aspect-square rounded-md bg-zinc-700 mb-4"></div>
                        <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2 "></div>
                        <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>

    </div>
  )
}

export default SectionGridSkeleton