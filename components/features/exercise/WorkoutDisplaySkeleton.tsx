import { Skeleton } from "@/components/ui/skeleton"

export function WorkoutDisplaySkeleton() {
    return (
        <div className="animate-fadeIn space-y-8 max-w-2xl mx-auto py-12">
            {/* Header Skeleton */}
            <div className="text-center space-y-4">
                <Skeleton className="h-8 w-48 mx-auto" />
                <div className="flex justify-center gap-8">
                    <Skeleton className="h-12 w-24 rounded-2xl" />
                    <Skeleton className="h-12 w-24 rounded-2xl" />
                    <Skeleton className="h-12 w-24 rounded-2xl" />
                </div>
            </div>

            {/* Timeline Skeleton */}
            <div className="relative border-l-2 border-dashed border-zinc-200 dark:border-zinc-800 ml-4 md:ml-8 space-y-12 pl-8 py-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative">
                        {/* Dot */}
                        <div className="absolute -left-[41px] top-0 p-1 bg-health-bg">
                            <Skeleton className="w-5 h-5 rounded-full" />
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-64" />
                            <div className="flex gap-2 pt-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
