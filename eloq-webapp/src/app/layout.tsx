import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { MainNavigation } from '@/components/navigation';
import { Trophy } from 'lucide-react';
import { initializeDatabaseOnce } from '@/lib/db/init-service';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import ErrorBoundary from '@/components/error-boundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ELOQ - Cue Sports Stats',
  description:
    'Track player performance and rankings with our ELOQ-uent rating system for cue sports.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize database connection
  try {
    await initializeDatabaseOnce();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // We don't want to crash the entire app if database initialization fails
    // In a real application, you might want to show an error page or retry
  }

  return (
    <ClerkProvider appearance={{ theme: shadcn }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <MainNavigation />
              <main className="container py-6 sm:py-8">{children}</main>
              <footer className="border-t py-6 md:py-8">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <div className="pool-table-bg w-8 h-8 rounded-full flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-center text-sm leading-loose md:text-left">
                      Built with ❤️ for pool and billiards enthusiasts
                    </p>
                  </div>
                  <p className="text-center text-sm text-muted-foreground md:text-right">
                    © {new Date().getFullYear()} ELOQ. All rights reserved.
                  </p>
                </div>
              </footer>
            </ErrorBoundary>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
