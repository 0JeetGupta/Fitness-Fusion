import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/firebase-error-listener';

export const metadata: Metadata = {
  title: 'Khel Khoj',
  description: 'AI-Powered Mobile Platform for Democratizing Sports Talent Assessment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <AuthProvider>
            {children}
            <Toaster />
            <FirebaseErrorListener />
          </AuthProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
