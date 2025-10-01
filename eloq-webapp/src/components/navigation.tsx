// Main navigation component using shadcn/ui
// This component provides the main navigation for the ELOQ web application

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser, useAuth } from '@clerk/nextjs';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { Menu, User, Trophy, Users, Calendar, Home, ChevronDown, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const navigationItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Players',
    href: '/players',
    icon: Users,
  },
  {
    title: 'Tournaments',
    href: '/tournaments',
    icon: Trophy,
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
];

export function MainNavigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo and main navigation */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="pool-table-bg w-8 h-8 rounded-full flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className="inline-block font-bold text-xl">ELOQ</span>
          </Link>
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <Link href={item.href} passHref>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                      active={pathname === item.href}
                    >
                      <span className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User actions */}
        <div className="flex items-center space-x-2">
          {/* Admin badge for demo purposes */}
          <Badge variant="secondary" className="hidden sm:flex">
            Admin
          </Badge>
          
          {/* Theme toggle */}
          <ThemeToggle />
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <UserButton afterSignOutUrl="/" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => {
                // Sign out functionality will be handled by the UserButton, 
                // but we include this as an additional logout option
                if (typeof window !== 'undefined') {
                  window.location.href = '/sign-in';
                }
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-2 py-4 border-b">
                  <div className="pool-table-bg w-10 h-10 rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <span className="inline-block font-bold text-2xl">ELOQ</span>
                </div>
                
                <nav className="flex flex-col space-y-2 py-6">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </nav>
                
                <Separator className="my-4" />
                
                <div className="mt-auto">
                  <div className="flex items-center space-x-3 rounded-lg px-4 py-3">
                    <UserButton afterSignOutUrl="/" />
                    <div className="flex flex-col">
                      <span className="font-medium">Pool Player</span>
                      <span className="text-sm text-muted-foreground">eloq.user@example.com</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/settings">
                        <span>Settings</span>
                      </Link>
                    </Button>
                    <div className="flex items-center justify-between w-full p-2 border rounded-md">
                      <span>Theme</span>
                      <ThemeToggle />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => {
                        // Redirect to sign-in page which will handle the logout
                        if (typeof window !== 'undefined') {
                          window.location.href = '/elements/clerk/sign-in';
                        }
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}