import React, { createContext, useContext, useState, useEffect } from 'react';
import { GradeClass } from '../types/curriculum.ts';
import { StudentProfile } from '../types/student.ts';
import { db, auth } from '../firebase.ts';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut as fbSignOut,
} from 'firebase/auth';

interface AuthContextType {
  student: StudentProfile | null;
  loading: boolean;
  loginOrRegister: (name: string, email: string, selectedClass: GradeClass) => Promise<void>;
  loginWithGoogle: (selectedClass?: GradeClass) => Promise<void>;
  loginDemoStudent: (selectedClass: GradeClass) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'studybuddy_student_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Sync auth state with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'students', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data() as StudentProfile;
            setStudent(data);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          }
        } catch (err) {
          console.warn('Could not read student profile from Firestore, using cached/local:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Google Sign-In with Popup
   * Connects to Google AI Studio's pre-configured Google Authentication provider
   */
  const loginWithGoogle = async (selectedClass: GradeClass = 'Class 6') => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;

      let existingProfile: StudentProfile | null = null;
      try {
        const snap = await getDoc(doc(db, 'students', user.uid));
        if (snap.exists()) {
          existingProfile = snap.data() as StudentProfile;
        }
      } catch (e) {
        console.warn('Could not check existing Firestore student profile:', e);
      }

      const now = new Date().toISOString();
      const targetClass = existingProfile?.selectedClass || selectedClass;
      const profile: StudentProfile = {
        studentId: user.uid,
        fullName: user.displayName || existingProfile?.fullName || 'Student Learner',
        email: user.email || existingProfile?.email || '',
        selectedClass: targetClass,
        createdAt: existingProfile?.createdAt || now,
        lastLoginAt: now,
      };

      try {
        await setDoc(doc(db, 'students', user.uid), profile, { merge: true });
      } catch (err) {
        console.warn('Firestore setDoc failed during Google sign-in:', err);
      }

      setStudent(profile);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } catch (err: any) {
      console.warn('Google sign-in completed or cancelled:', err?.message || err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Standard student entry using Full Name, Email, and Selected Class.
   * Eliminates anonymous sign-in calls which cause auth/admin-restricted-operation.
   */
  const loginOrRegister = async (name: string, email: string, selectedClass: GradeClass) => {
    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim() || 'Learner';
      const currentUser = auth.currentUser;

      // Use Firebase UID if user is already authenticated via Google, otherwise generate deterministic ID
      const studentId = currentUser?.uid || `std_${trimmedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const now = new Date().toISOString();

      const profile: StudentProfile = {
        studentId,
        fullName: trimmedName,
        email: trimmedEmail,
        selectedClass,
        createdAt: student?.createdAt || now,
        lastLoginAt: now,
      };

      // If signed into Firebase, persist directly to Cloud Firestore
      if (currentUser) {
        try {
          await setDoc(doc(db, 'students', currentUser.uid), profile, { merge: true });
        } catch (err) {
          console.warn('Firestore profile sync warning:', err);
        }
      }

      setStudent(profile);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } finally {
      setLoading(false);
    }
  };

  /**
   * One-Click Demo Student Login for rapid evaluation across Classes 6–10
   */
  const loginDemoStudent = async (selectedClass: GradeClass) => {
    const demoNames: Record<GradeClass, string> = {
      'Class 6': 'Aarav Sharma',
      'Class 7': 'Ananya Verma',
      'Class 8': 'Rohan Iyer',
      'Class 9': 'Priya Patel',
      'Class 10': 'Aditya Singh',
    };
    const name = demoNames[selectedClass] || 'Demo Student';
    const email = `${selectedClass.toLowerCase().replace(' ', '')}@studybuddy.edu`;
    await loginOrRegister(name, email, selectedClass);
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        await fbSignOut(auth);
      }
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
    setStudent(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        loading,
        loginOrRegister,
        loginWithGoogle,
        loginDemoStudent,
        logout,
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
