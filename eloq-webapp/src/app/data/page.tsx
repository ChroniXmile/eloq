import { DataDisplay } from "@/components/data/data-display";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DataPage() {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="max-w-6xl w-full space-y-8">
        <section className="text-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Dynamic Data Management
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This page demonstrates dynamic data fetching and submission using
            Next.js API routes and PostgreSQL database integration.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Dynamic functionality demonstration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Data is fetched from a PostgreSQL database via API routes</li>
              <li>New items can be submitted and will appear in real-time</li>
              <li>Loading states and error handling are implemented</li>
              <li>All functionality is responsive and accessible</li>
            </ul>
          </CardContent>
        </Card>

        <DataDisplay />
      </div>
    </div>
  );
}
