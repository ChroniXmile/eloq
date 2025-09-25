import { Card, CardContent } from "@/components/ui/card";

export function PlayerCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-muted" />
          <div>
            <div className="h-4 w-24 bg-muted rounded mb-2"></div>
            <div className="h-3 w-16 bg-muted rounded"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <div className="h-3 w-12 bg-muted rounded mb-1"></div>
            <div className="h-6 w-16 bg-muted rounded"></div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-3 w-12 bg-muted rounded mb-1"></div>
            <div className="h-6 w-16 bg-muted rounded"></div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-3 w-12 bg-muted rounded mb-1"></div>
            <div className="h-4 w-8 bg-muted rounded"></div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-3 w-12 bg-muted rounded mb-1"></div>
            <div className="h-4 w-8 bg-muted rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}