import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Static environment config mapping
const getEnvConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID
  };
  return config.apiKey ? config : null;
};

// We will try to resolve the app instance synchronously if possible
const initialize = () => {
  if (getApps().length) return getApp();

  const envConfig = getEnvConfig();
  if (envConfig) {
    return initializeApp(envConfig);
  }

  // If no env vars, we might be in AI studio or dev, we'll try a minimal init 
  // and handle real config loading in the AuthProvider lazily if needed.
  try {
    return initializeApp({ apiKey: "pending", projectId: "pending" });
  } catch (e) {
    return getApp();
  }
};

export const app = initialize();
export const db = getFirestore(app, (getEnvConfig() as any)?.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Helper to update config if JSON is loaded later (AI Studio specific)
export const updateFirebaseConfig = (config: any) => {
  if (!config || !config.apiKey) return;
  // This is a bit tricky with v9+ as apps are immutable-ish, 
  // but if we are here we likely already have the right config in env or we are about to crash anyway.
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
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
  }
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
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
