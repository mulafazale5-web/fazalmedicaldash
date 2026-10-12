import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  createdAt: string;
}

export const ADMIN_EMAIL = 'fazalghouri@gmail.com';
export const ADMIN_PASS = '12613';

export interface AdminUser {
  email: string;
  name: string;
  role: 'super_admin';
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  adminUser: AdminUser | null;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string, phone?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  adminLogin: (email: string, pass: string) => Promise<boolean>;
  adminLogout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('mgicare_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const fetchUserProfile = async (firebaseUser: User) => {
    // Check local profile cache first
    const localCachedRaw = localStorage.getItem(`mgicare_user_${firebaseUser.uid}`);
    let localProfile: UserProfile | null = null;
    if (localCachedRaw) {
      try {
        localProfile = JSON.parse(localCachedRaw);
        setUserProfile(localProfile);
      } catch (e) {
        // ignore
      }
    }

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const firestoreData = snap.data() as UserProfile;
        setUserProfile(firestoreData);
        localStorage.setItem(`mgicare_user_${firebaseUser.uid}`, JSON.stringify(firestoreData));
      } else {
        // Create initial profile if missing (e.g. initial Google sign-in)
        const newProfile: UserProfile = localProfile || {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Patient',
          phone: firebaseUser.phoneNumber || '',
          createdAt: new Date().toISOString()
        };
        setUserProfile(newProfile);
        localStorage.setItem(`mgicare_user_${firebaseUser.uid}`, JSON.stringify(newProfile));
        try {
          await setDoc(userDocRef, newProfile);
        } catch (setErr) {
          handleFirestoreError(setErr, OperationType.WRITE, `users/${firebaseUser.uid}`);
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
      if (!localProfile) {
        const fallback: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Patient',
          createdAt: new Date().toISOString()
        };
        setUserProfile(fallback);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await fetchUserProfile(cred.user);
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string, phone?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName });

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName: displayName.trim(),
      phone: phone ? phone.trim() : '',
      createdAt: new Date().toISOString()
    };

    // Cache immediately so user data is not lost even if remote Firestore rules are restrictive
    localStorage.setItem(`mgicare_user_${cred.user.uid}`, JSON.stringify(newProfile));
    setUserProfile(newProfile);

    try {
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${cred.user.uid}`);
    }
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await fetchUserProfile(cred.user);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const adminLogin = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPass = pass.trim();

    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPass === ADMIN_PASS) {
      const adminData: AdminUser = {
        email: ADMIN_EMAIL,
        name: 'Fazal Ghouri (Chief Medical Administrator)',
        role: 'super_admin'
      };
      setAdminUser(adminData);
      localStorage.setItem('mgicare_admin_session', JSON.stringify(adminData));
      return true;
    }

    // Also try Firebase sign in if admin registered there
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        const adminData: AdminUser = {
          email: ADMIN_EMAIL,
          name: cred.user.displayName || 'Fazal Ghouri (Admin)',
          role: 'super_admin'
        };
        setAdminUser(adminData);
        localStorage.setItem('mgicare_admin_session', JSON.stringify(adminData));
        return true;
      }
    } catch (e) {
      // ignore
    }

    throw new Error('Invalid administrator credentials.');
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('mgicare_admin_session');
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  const isAdmin = !!adminUser || (user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        adminUser,
        signInWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        logout,
        adminLogin,
        adminLogout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
