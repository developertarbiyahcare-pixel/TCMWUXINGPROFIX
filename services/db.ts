import { UserAccount, SavedPatient, AppSettings } from '../types';
import { db as firestore, auth } from '../firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

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

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
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
  createdAt: Date.now(),
  provider: 'local'
};

export const db = {
  settings: {
    get: async (): Promise<AppSettings | null> => {
      // 1. Try Firestore first if logged in
      if (auth.currentUser) {
        try {
          const snap = await getDoc(doc(firestore, 'settings', 'config'));
          if (snap.exists()) {
            return snap.data() as AppSettings;
          }
        } catch (e) {
          console.warn("Error fetching settings from Firestore, falling back to local:", e);
        }
      }
      
      // 2. Fallback to LocalStorage
      const local = localStorage.getItem('tcm_app_settings');
      const data = local ? JSON.parse(local) : null;
      if (data && !data.geminiApiKeys) {
        data.geminiApiKeys = [];
      }
      return data;
    },
    update: async (settings: AppSettings): Promise<{ success: boolean; error?: string }> => {
      try {
        // 1. Save to LocalStorage always
        const settingsString = JSON.stringify(settings);
        localStorage.setItem('tcm_app_settings', settingsString);

        // 2. Try to sync to Firestore if logged in
        if (auth.currentUser) {
          try {
            await setDoc(doc(firestore, 'settings', 'config'), settings);
          } catch (fireError: any) {
            console.error("Cloud sync failed for settings:", fireError);
            // If it's a permission error, it's expected if they aren't an admin
            if (fireError.message?.includes("insufficient permissions")) {
               return { success: true, error: "Saved locally, but Cloud sync failed (Insufficient Permissions). Only Admins can sync settings to Cloud." };
            }
            throw fireError;
          }
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
        return true;
      } catch (e) {
        console.error('Error (users.add):', e);
        return false;
      }
    },
    delete: async (uid: string): Promise<boolean> => {
      try {
        const users = await db.users.getAll();
        const filtered = users.filter(u => u.uid !== uid && u.username !== uid);
        localStorage.setItem('tcm_users', JSON.stringify(filtered));
        return true;
      } catch (e) {
        console.error('Error (users.delete):', e);
        return false;
      }
    }
  },
  patients: {
    getAll: async (): Promise<SavedPatient[]> => {
      const localData = localStorage.getItem('tcm_patients_local');
      const currentUserUid = auth.currentUser?.uid || 'local-guest';
      let patients: SavedPatient[] = localData ? (JSON.parse(localData) as SavedPatient[]).filter(p => p.authorUid === currentUserUid) : [];
      
      // If logged in with Google, also fetch from Firestore
      if (auth.currentUser) {
        try {
          const q = query(collection(firestore, 'patients'), where('authorUid', '==', auth.currentUser.uid));
          const querySnapshot = await getDocs(q);
          const cloudPatients = querySnapshot.docs.map(doc => doc.data() as SavedPatient);
          
          // Merge (Local takes priority if timestamp is newer, but usually Firestore is the master)
          const merged = [...patients];
          cloudPatients.forEach(cp => {
            const index = merged.findIndex(p => p.id === cp.id);
            if (index === -1) {
              merged.push(cp);
            } else if (cp.timestamp > merged[index].timestamp) {
              merged[index] = cp;
            }
          });
          patients = merged;
        } catch (e) {
          console.error("Cloud fetch failed:", e);
        }
      }
      
      return patients.sort((a, b) => b.timestamp - a.timestamp);
    },
    add: async (patient: SavedPatient) => {
      const authorUid = auth.currentUser?.uid || 'local-guest';
      const patientWithAuth = { ...patient, authorUid };
      
      if (!patientWithAuth.id) {
         patientWithAuth.id = Date.now().toString();
      }

      // Save Local
      try {
         const localData = localStorage.getItem('tcm_patients_local');
         const patients: SavedPatient[] = localData ? JSON.parse(localData) : [];
         const newPatients = [...patients.filter(p => p.id !== patientWithAuth.id), patientWithAuth];
         localStorage.setItem('tcm_patients_local', JSON.stringify(newPatients));
      } catch (err) {}

      // Save Cloud if logged in
      if (auth.currentUser) {
        try {
          await setDoc(doc(firestore, 'patients', patientWithAuth.id), patientWithAuth);
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, `patients/${patientWithAuth.id}`);
        }
      }
    },
    delete: async (id: string) => {
      // Delete Local
      try {
         const localData = localStorage.getItem('tcm_patients_local');
         if (localData) {
            const patients: SavedPatient[] = JSON.parse(localData);
            localStorage.setItem('tcm_patients_local', JSON.stringify(patients.filter(p => p.id !== id)));
         }
      } catch (err) {}

      // Delete Cloud if logged in
      if (auth.currentUser) {
        try {
          await deleteDoc(doc(firestore, 'patients', id));
        } catch (e) {
          handleFirestoreError(e, OperationType.DELETE, `patients/${id}`);
        }
      }
    }
  }
};

