
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsWidgetSkeleton() {
    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
            </div>

            {/* List */}
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-3">
                        <Skeleton className="w-[60px] h-[60px] rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-2 w-1/3 mt-1" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
