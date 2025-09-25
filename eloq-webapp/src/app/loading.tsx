import { CardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-1/3 bg-muted rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
      </div>
      
      <CardSkeleton />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}