import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 p-4">
      <div className="pool-ball-solid w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 text-white flex items-center justify-center">
        <Trophy className="h-12 w-12" />
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/players">Browse Players</Link>
        </Button>
      </div>
    </div>
  );
}