import { UserAccount, SavedPatient, AppSettings } from '../types';
import { db as firestore, auth } from '../firebase';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { supabase } from '../supabase';

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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const DEFAULT_ADMIN: UserAccount = {
  uid: 'admin-init',
  username: 'admin',
  password: 'admin123', 
  role: 'SUPER_SAINT',
  createdAt: Date.now()
};

export const db = {
  settings: {
    get: async (): Promise<AppSettings | null> => {
      const local = localStorage.getItem('tcm_app_settings');
      const localData = local ? JSON.parse(local) : null;

      if (!auth.currentUser) {
        if (localData && !localData.geminiApiKeys) {
          localData.geminiApiKeys = [];
        }
        return localData;
      }

      try {
        const docRef = doc(firestore, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as AppSettings;
          const mergedData = {
            ...data,
            geminiApiKeys: data.geminiApiKeys || []
          };
          localStorage.setItem('tcm_app_settings', JSON.stringify(mergedData));
          return mergedData;
        }
        
        if (localData && !localData.geminiApiKeys) {
          localData.geminiApiKeys = [];
        }
        return localData;
      } catch (e) {
        return handleFirestoreError(e, OperationType.GET, 'settings');
      }
    },
    update: async (settings: AppSettings): Promise<{ success: boolean; error?: string }> => {
      try {
        const settingsString = JSON.stringify(settings);
        localStorage.setItem('tcm_app_settings', settingsString);

        if (!auth.currentUser) {
          return { success: true };
        }

        const payload = { 
          geminiApiKey: settings.geminiApiKey || '',
          geminiApiKeys: settings.geminiApiKeys || [],
          clinicName: settings.clinicName || '',
          clinicAddress: settings.clinicAddress || '',
          clinicPhone: settings.clinicPhone || ''
        };

        const docPath = 'settings';
        try {
          await setDoc(doc(firestore, 'settings', 'global'), payload, { merge: true });
        } catch (e: any) {
           return handleFirestoreError(e, OperationType.WRITE, docPath);
        }
        return { success: true };
      } catch (e: any) {
        console.error('Error in settings.update', e);
        return { success: false, error: e.message || "An unexpected error occurred while saving." };
      }
    }
  },
  users: {
    getAll: async (): Promise<UserAccount[]> => {
      const local = localStorage.getItem('tcm_users');
      if (local) {
        try {
          return JSON.parse(local);
        } catch (e) {
          console.error('Error parsing local users', e);
        }
      }
      return [DEFAULT_ADMIN];
    },
    add: async (user: UserAccount): Promise<boolean> => {
      try {
        const users = await db.users.getAll();
        const existingIndex = users.findIndex(u => u.username === user.username);
        if (existingIndex >= 0) {
          users[existingIndex] = user;
        } else {
          users.push(user);
        }
        localStorage.setItem('tcm_users', JSON.stringify(users));

        if (auth.currentUser) {
          try {
            const firebaseUser = { 
              ...user, 
              createdAt: user.createdAt || Date.now() 
            };
            await setDoc(doc(firestore, 'users', user.uid), firebaseUser);
          } catch(e) {
            handleFirestoreError(e, OperationType.WRITE, 'users');
            return false;
          }
        }
        return true;
      } catch (e) {
        console.error('Error (users.add):', e);
        return false;
      }
    },
    register: async (user: Omit<UserAccount, 'uid' | 'createdAt' | 'role'>): Promise<boolean> => {
      try {
         // this may be obsolete, but keeping it
         return true;
      } catch (e) {
        console.error('Error (users.register):', e);
        return false;
      }
    },
    delete: async (uid: string): Promise<boolean> => {
      try {
        const users = await db.users.getAll();
        const filtered = users.filter(u => u.uid !== uid && u.username !== uid);
        localStorage.setItem('tcm_users', JSON.stringify(filtered));

        if (auth.currentUser) {
          try {
            await deleteDoc(doc(firestore, 'users', uid));
          } catch(e) {
            handleFirestoreError(e, OperationType.DELETE, 'users');
          }
        }
        return true;
      } catch (e) {
        console.error('Error (users.delete):', e);
        return false;
      }
    }
  },
  patients: {
    getAll: async (): Promise<SavedPatient[]> => {
      if (!auth.currentUser) {
        const localData = localStorage.getItem('tcm_patients_local');
        return localData ? JSON.parse(localData) : [];
      }
      
      const uid = auth.currentUser.uid;
      try {
        const q = query(collection(firestore, 'patients'), where('authorUid', '==', uid));
        const querySnapshot = await getDocs(q);
        const patients: SavedPatient[] = [];
        querySnapshot.forEach((d) => {
          patients.push(d.data() as SavedPatient);
        });
        return patients;
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'patients');
        return [];
      }
    },
    add: async (patient: SavedPatient) => {
      const uid = auth.currentUser?.uid || 'local-guest';
      const patientWithAuth = { ...patient, authorUid: uid };

      if (!patientWithAuth.id) {
         patientWithAuth.id = Date.now().toString();
      }

      try {
         const localData = localStorage.getItem('tcm_patients_local');
         const patients: SavedPatient[] = localData ? JSON.parse(localData) : [];
         const newPatients = [...patients.filter(p => p.id !== patient.id), patientWithAuth];
         localStorage.setItem('tcm_patients_local', JSON.stringify(newPatients));
      } catch (err) {}

      if (auth.currentUser) {
        try {
          const firebasePatient = { 
            ...patientWithAuth, 
            timestamp: patientWithAuth.timestamp || Date.now() 
          };
          await setDoc(doc(firestore, 'patients', patientWithAuth.id), firebasePatient);
        } catch (e) {
           handleFirestoreError(e, OperationType.WRITE, 'patients');
        }
      }
    },
    delete: async (id: string) => {
      try {
         const localData = localStorage.getItem('tcm_patients_local');
         if (localData) {
            const patients: SavedPatient[] = JSON.parse(localData);
            localStorage.setItem('tcm_patients_local', JSON.stringify(patients.filter(p => p.id !== id)));
         }
      } catch (err) {}

      if (auth.currentUser) {
        try {
          await deleteDoc(doc(firestore, 'patients', id));
        } catch (e) {
           handleFirestoreError(e, OperationType.DELETE, 'patients');
        }
      }
    }
  }
};

