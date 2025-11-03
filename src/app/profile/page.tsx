'use client';

import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-6 w-56" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
           <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          <h1 className="text-3xl font-bold font-headline mb-6">My Profile</h1>
          <Card>
            <CardHeader>
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-primary">
                        <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} alt={user.displayName || 'User'} />
                        <AvatarFallback className="text-3xl">{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl font-headline">{user.displayName}</CardTitle>
                        <CardDescription className="text-lg">{user.email}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This is your personal profile page. More details and stats about your performance will be displayed here in the future.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
