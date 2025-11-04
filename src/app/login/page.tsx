'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { KhelKhojIcon } from '@/components/header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verified' | 'failed'>('idle');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleEmailLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    toast({
      variant: 'destructive',
      title: 'Not Implemented',
      description: 'Google Sign-In is not implemented in this local setup.',
    });
  };

  const handleFaceVerification = async () => {
    setIsCameraOpen(true);
    setVerificationStatus('idle');
    setIsScanning(true);
    setHasCameraPermission(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Simulate verification process
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% chance of success for demo
        setVerificationStatus(success ? 'verified' : 'failed');
        setIsScanning(false);
        // Turn off the camera after simulation
        stream.getTracks().forEach(track => track.stop());
        if(videoRef.current) videoRef.current.srcObject = null;
        
        toast({
          title: success ? 'Face Verified!' : 'Verification Failed',
          description: success ? 'You can now log in.' : 'Please try again or use email.',
          variant: success ? 'default' : 'destructive',
        });

        // Close the camera view after a short delay
        setTimeout(() => setIsCameraOpen(false), 2000);

      }, 3000);

    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setIsScanning(false);
      setIsCameraOpen(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature.',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <KhelKhojIcon className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">Khel Khoj</span>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Login</CardTitle>
            <CardDescription>Access your athlete dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            {isCameraOpen ? (
              <div className="space-y-4 text-center">
                 <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {isScanning && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-primary-foreground mt-2">Scanning...</p>
                        </div>
                    )}
                    {verificationStatus === 'verified' && (
                       <div className="absolute inset-0 bg-green-500/80 flex flex-col items-center justify-center">
                           <CheckCircle className="h-12 w-12 text-white" />
                           <p className="text-lg font-bold text-white mt-2">Verified</p>
                       </div>
                    )}
                    {verificationStatus === 'failed' && (
                         <div className="absolute inset-0 bg-destructive/80 flex flex-col items-center justify-center">
                           <XCircle className="h-12 w-12 text-white" />
                           <p className="text-lg font-bold text-white mt-2">Failed</p>
                       </div>
                    )}
                 </div>
                 {hasCameraPermission === false && (
                    <Alert variant="destructive">
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access to use this feature.
                      </AlertDescription>
                    </Alert>
                 )}
                 <Button variant="outline" onClick={() => setIsCameraOpen(false)} className="w-full">
                    Cancel
                 </Button>
              </div>
            ) : (
              <>
                <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="athlete@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login with Email
                    </Button>
                  </form>
                </FormProvider>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleGoogleSignIn}>
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 102.3 282.7 90 248 90c-82.6 0-150.2 67.5-150.2 150.2s67.6 150.2 150.2 150.2c91.9 0 130.6-62.8 135.3-98.2H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
                    Google
                  </Button>
                  <Button variant="outline" onClick={handleFaceVerification}>
                    <Camera className="mr-2 h-4 w-4" />
                    Verify with Face
                  </Button>
                </div>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/signup" className="font-semibold text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
