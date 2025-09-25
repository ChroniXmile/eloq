'use client';

'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserModel } from '@/models/user';
import { useUser, ClerkProvider } from '@clerk/nextjs';

interface ProfileFormState {
  displayName: string;
  email: string;
  avatarUrl: string;
  preferences: {
    [key: string]: any;
  };
}

export default function ProfilePage() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [user, setUser] = useState<UserModel | null>(null);
  const [formData, setFormData] = useState<ProfileFormState>({
    displayName: '',
    email: '',
    avatarUrl: '',
    preferences: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load user data once Clerk user is loaded
  useEffect(() => {
    if (isClerkLoaded && clerkUser) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/profile');

          if (!response.ok) {
            if (response.status === 404) {
              // User doesn't exist in our database, create a basic profile
              setFormData({
                displayName:
                  clerkUser.fullName ||
                  clerkUser.username ||
                  clerkUser.primaryEmailAddress?.emailAddress ||
                  '',
                email: clerkUser.primaryEmailAddress?.emailAddress || '',
                avatarUrl: clerkUser.imageUrl || '',
                preferences: {},
              });
            } else {
              throw new Error('Failed to fetch user data');
            }
          } else {
            const userData = await response.json();
            setUser(userData);
            setFormData({
              displayName: userData.displayName || '',
              email: userData.email || '',
              avatarUrl: userData.avatarUrl || '',
              preferences: userData.preferences || {},
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load profile data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    } else if (isClerkLoaded && !clerkUser) {
      // User is not authenticated
      setIsLoading(false);
      setError('You must be signed in to view this page');
    }
  }, [isClerkLoaded, clerkUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: formData.displayName,
          email: formData.email,
          avatarUrl: formData.avatarUrl,
          preferences: formData.preferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500 text-green-700 dark:text-green-300 rounded-md">
            {success}
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Manage your account information and preferences
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={formData.avatarUrl}
                    alt={formData.displayName}
                  />
                  <AvatarFallback>
                    {formData.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter a URL to an image for your avatar
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={user?.username || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  Username cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label>Preferences</Label>
                <div className="space-y-4 p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          formData.preferences.emailNotifications
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() =>
                          handlePreferenceChange('emailNotifications', true)
                        }
                      >
                        On
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          !formData.preferences.emailNotifications
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() =>
                          handlePreferenceChange('emailNotifications', false)
                        }
                      >
                        Off
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dashboard Theme</p>
                      <p className="text-sm text-muted-foreground">
                        Choose your dashboard theme
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          formData.preferences.dashboardTheme === 'light'
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() =>
                          handlePreferenceChange('dashboardTheme', 'light')
                        }
                      >
                        Light
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          formData.preferences.dashboardTheme === 'dark'
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() =>
                          handlePreferenceChange('dashboardTheme', 'dark')
                        }
                      >
                        Dark
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
