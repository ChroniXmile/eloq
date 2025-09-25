import { Card, CardContent } from "@/components/ui/card";

export function CardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-6 w-3/4 bg-muted rounded"></div>
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-5/6 bg-muted rounded"></div>
          <div className="h-4 w-2/3 bg-muted rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded"></div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-muted"></div>
        <div className="space-y-3">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted rounded"></div>
            <div className="h-6 w-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <div className="h-6 w-1/3 bg-muted rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-3 w-3/4 bg-muted rounded"></div>
                    <div className="h-6 w-full bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}