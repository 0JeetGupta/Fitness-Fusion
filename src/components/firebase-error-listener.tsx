'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

// This is a client component that will listen for the custom event
// and throw the error to be caught by Next.js's error boundary.
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      // Throwing the error here will propagate it to the nearest error boundary.
      // In Next.js, this will be the Error Overlay in development.
      throw error;
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // This component does not render anything.
  return null;
}
