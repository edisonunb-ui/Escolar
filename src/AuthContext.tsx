import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthorized: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'edisonunb@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Check if user is the hardcoded Admin
        const adminStatus = firebaseUser.email === ADMIN_EMAIL;
        setIsAdmin(adminStatus);

        if (adminStatus) {
          setIsAuthorized(true);
        } else {
          // For other users, check 'authorized_emails' collection in Firestore
          try {
            const authDoc = await getDoc(doc(db, 'authorized_emails', firebaseUser.email || ''));
            if (authDoc.exists() && authDoc.data().authorized === true) {
              setIsAuthorized(true);
            } else {
              setIsAuthorized(false);
              // Optional: auto logout if not authorized
              // await signOut(auth);
            }
          } catch (error) {
            console.error("Error checking authorization:", error);
            setIsAuthorized(false);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isAuthorized, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
