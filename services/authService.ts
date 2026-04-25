
import { UserAccount } from '../types';
import { db as localDb } from './db';

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
  console.warn("Google Login is disabled (Firebase removed)");
  return null;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('tcm_active_session');
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
    createdAt: Date.now()
  };
  const ok = await localDb.users.add(newUser);
  return ok ? { success: true, message: 'Registrasi berhasil!' } : { success: false, message: 'Registrasi gagal.' };
};

