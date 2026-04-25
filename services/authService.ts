
import { UserAccount } from '../types';
import { db as localDb } from './db';
import { auth, db as firestore } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Ensure DB is initialized
export const getUsers = async (): Promise<UserAccount[]> => {
  return await localDb.users.getAll();
};

export const saveUser = async (user: UserAccount): Promise<{ success: boolean, message: string }> => {
  // Simple validation
  if (!user.username || !user.password) {
      return { success: false, message: 'Username and password are required.' };
  }
  
  const success = await localDb.users.add(user);
  if (success) {
      return { success: true, message: 'User successfully saved to database.' };
  } else {
      return { success: false, message: 'Username already exists.' };
  }
};

export const deleteUser = async (username: string): Promise<{ success: boolean, message: string }> => {
  if (username === 'admin') {
      return { success: false, message: 'Cannot delete the main admin account.' };
  }
  
  const success = await localDb.users.delete(username);
  if (success) {
      return { success: true, message: 'User deleted from database.' };
  } else {
      return { success: false, message: 'User not found.' };
  }
};

export const loginWithGoogle = async (): Promise<UserAccount | null> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;

    if (!fbUser) return null;

    // Check if user exists in Firestore
    const userRef = doc(firestore, 'users', fbUser.uid);
    const userSnap = await getDoc(userRef);

    let role: 'ADMIN' | 'REGULAR' | 'SUPER_SAINT' | 'SUPER_USER' = 'REGULAR';
    
    // Bootstrap Admin: If the email matches the developer email, make them SUPER_SAINT
    const BOOTSTRAP_ADMINS = ['developertarbiyahcare@gmail.com', 'nvardi75@gmail.com'];
    
    if (userSnap.exists()) {
      const existingData = userSnap.data();
      role = existingData.role as any || 'REGULAR';
      
      // Auto-upgrade developer emails if they are stuck as regular
      if (fbUser.email && BOOTSTRAP_ADMINS.includes(fbUser.email) && role !== 'SUPER_SAINT') {
        role = 'SUPER_SAINT';
        await setDoc(userRef, { role: 'SUPER_SAINT' }, { merge: true });
      }
    } else {
      // If first time login and matches bootstrap email, grant high privileges
      if (fbUser.email && BOOTSTRAP_ADMINS.includes(fbUser.email)) {
        role = 'SUPER_SAINT';
      }

      // Create new user in Firestore
      await setDoc(userRef, {
        uid: fbUser.uid,
        username: fbUser.email,
        role: role,
        createdAt: Date.now(),
        provider: 'google'
      });
    }

    const userData: UserAccount = {
      uid: fbUser.uid,
      username: fbUser.email || '',
      password: '', // No password for Google users
      role: role,
      createdAt: Date.now(),
      provider: 'google'
    };

    // Save to local DB as well for session consistency
    await localDb.users.add(userData);
    
    return userData;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('tcm_active_session');
  await auth.signOut();
};

// Legacy login for local storage fallback
export const login = async (email: string, password: string): Promise<UserAccount | null> => {
  const users = await getUsers();
  const user = users.find(u => u.username === email && u.password === password);
  return user || null;
};

export const register = async (email: string, password: string, fullName: string): Promise<{ success: boolean, message: string }> => {
  const newUser: UserAccount = {
    uid: Date.now().toString(),
    username: email,
    password: password,
    role: 'REGULAR',
    createdAt: Date.now(),
    provider: 'local'
  };
  const ok = await localDb.users.add(newUser);
  return ok ? { success: true, message: 'Registrasi berhasil!' } : { success: false, message: 'Registrasi gagal.' };
};

