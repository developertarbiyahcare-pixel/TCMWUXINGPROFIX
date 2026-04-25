import { UserAccount, SavedPatient, AppSettings } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
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
      const data = local ? JSON.parse(local) : null;
      if (data && !data.geminiApiKeys) {
        data.geminiApiKeys = [];
      }
      return data;
    },
    update: async (settings: AppSettings): Promise<{ success: boolean; error?: string }> => {
      try {
        const settingsString = JSON.stringify(settings);
        localStorage.setItem('tcm_app_settings', settingsString);
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
    register: async (user: Omit<UserAccount, 'uid' | 'createdAt' | 'role'>): Promise<boolean> => {
      return true;
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
      return localData ? JSON.parse(localData) : [];
    },
    add: async (patient: SavedPatient) => {
      const patientWithAuth = { ...patient, authorUid: 'local-guest' };
      if (!patientWithAuth.id) {
         patientWithAuth.id = Date.now().toString();
      }
      try {
         const localData = localStorage.getItem('tcm_patients_local');
         const patients: SavedPatient[] = localData ? JSON.parse(localData) : [];
         const newPatients = [...patients.filter(p => p.id !== patient.id), patientWithAuth];
         localStorage.setItem('tcm_patients_local', JSON.stringify(newPatients));
      } catch (err) {}
    },
    delete: async (id: string) => {
      try {
         const localData = localStorage.getItem('tcm_patients_local');
         if (localData) {
            const patients: SavedPatient[] = JSON.parse(localData);
            localStorage.setItem('tcm_patients_local', JSON.stringify(patients.filter(p => p.id !== id)));
         }
      } catch (err) {}
    }
  }
};

