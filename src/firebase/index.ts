import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
import { FirebaseClientProvider } from './client-provider';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(firebaseApp);
autoConnectToEmulator(auth, 'localhost', 9099);
  const firestore = getFirestore(firebaseApp);
autoConnectToEmulator(firestore, 'localhost', 8080);
  return { firebaseApp, auth, firestore };
}

export {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
function autoConnectToEmulator(service: Auth | Firestore, host: string, port: number) {
  // @ts-ignore
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && !service.emulatorConfig) {
    // @ts-ignore
    const connect = service.constructor.name === 'Auth' ? require('firebase/auth').connectAuthEmulator : require('firebase/firestore').connectFirestoreEmulator;
    // @ts-ignore
    connect(service, host, port);
  }
}
