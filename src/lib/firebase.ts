import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCUwbgy2XyKS_74WWvc6hYpWWDmMxlKhao",
  authDomain: "mgicarehospital.firebaseapp.com",
  projectId: "mgicarehospital",
  storageBucket: "mgicarehospital.firebasestorage.app",
  messagingSenderId: "260792553984",
  appId: "1:260792553984:web:f5b41afcbad50959f6bee5"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export let lastFirestoreError: FirestoreErrorInfo | null = null;
const permissionListeners: Array<(info: FirestoreErrorInfo) => void> = [];

export function onFirestorePermissionError(cb: (info: FirestoreErrorInfo) => void) {
  permissionListeners.push(cb);
  return () => {
    const idx = permissionListeners.indexOf(cb);
    if (idx !== -1) permissionListeners.splice(idx, 1);
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  lastFirestoreError = errInfo;
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  permissionListeners.forEach(listener => listener(errInfo));
  return errInfo;
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or initializing.");
    }
  }
}

// Call test connection non-blockingly
testConnection();
