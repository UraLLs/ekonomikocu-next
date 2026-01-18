
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsSectionSkeleton() {
    return (
        <section className="flex flex-col gap-5 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>

            {/* Hero Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4">
                {/* Main Card */}
                <div className="md:row-span-2 block">
                    <Skeleton className="w-full aspect-video md:aspect-[16/10] rounded-xl" />
                    <div className="mt-4 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                </div>

                {/* Side Cards */}
                {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 p-4 border border-white/5 rounded-xl">
                        <Skeleton className="w-1/3 aspect-video rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-3 w-1/4 mt-2" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border border-white/5 rounded-lg flex gap-3">
                        <Skeleton className="w-20 h-16 rounded-md" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
