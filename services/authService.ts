
import { UserAccount } from '../types';
import { db as localDb } from './db';
import { auth, signInWithPopup, googleProvider, signOut } from '../firebase';

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
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    if (user) {
      const userAccount: UserAccount = {
        uid: user.uid,
        username: user.displayName || user.email || 'User',
        password: '', // Don't store password in memory
        role: 'REGULAR',
        createdAt: new Date(user.metadata.creationTime || Date.now()).getTime()
      };
      
      // Save to local db for management
      await localDb.users.add(userAccount);
      return userAccount;
    }
    return null;
  } catch (error: any) {
    console.error("Firebase Login Error:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase Logout Error:", error);
  }
};

// Legacy login for local storage fallback
export const login = async (email: string, password: string): Promise<UserAccount | null> => {
  const users = await getUsers();
  const user = users.find(u => u.username === email && u.password === password);
  return user || null;
};

export const register = async (email: string, password: string, fullName: string): Promise<{ success: boolean, message: string }> => {
  const ok = await localDb.users.register({ username: email, password });
  return ok ? { success: true, message: 'Registrasi berhasil!' } : { success: false, message: 'Registrasi gagal.' };
};

