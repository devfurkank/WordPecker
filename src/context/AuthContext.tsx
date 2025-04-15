import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, AuthContextProps } from '../types';

// Create the default auth state
const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create the context with default values
const AuthContext = createContext<AuthContextProps>({
  authState: defaultAuthState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  // Register a new user
  const register = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName: name });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        createdAt: new Date().toISOString(),
        lists: [],
        progress: {
          totalWords: 0,
          learnedWords: 0,
          streak: 0,
          lastActivity: new Date().toISOString()
        }
      });
      
      // Create user object for state
      const userData: User = {
        id: user.uid,
        email: user.email || '',
        name: name,
        createdAt: new Date().toISOString()
      };
      
      // Store user and token
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', user.uid);
      
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Registration failed. Please try again.',
      }));
      throw error;
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let userData: User;
      
      if (userDoc.exists()) {
        const firestoreData = userDoc.data();
        userData = {
          id: user.uid,
          email: user.email || '',
          name: firestoreData.displayName || '',
          createdAt: firestoreData.createdAt || new Date().toISOString()
        };
      } else {
        userData = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          createdAt: new Date().toISOString()
        };
      }
      
      // Store user and token
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', user.uid);
      
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed. Please check your credentials.',
      }));
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      
      setAuthState({
        ...defaultAuthState,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Reset password (not exposed in interface but used in ForgotPasswordScreen)
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Check for existing token/user on load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // User is signed in
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          let userData: User;
          
          if (userDoc.exists()) {
            const firestoreData = userDoc.data();
            userData = {
              id: user.uid,
              email: user.email || '',
              name: firestoreData.displayName || '',
              createdAt: firestoreData.createdAt || new Date().toISOString()
            };
            
            // Store user and token
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            await AsyncStorage.setItem('token', user.uid);
            
            setAuthState({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // User exists in Auth but not in Firestore
            setAuthState({
              ...defaultAuthState,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setAuthState({
            ...defaultAuthState,
            isLoading: false,
            error: 'Failed to load user data',
          });
        }
      } else {
        // User is signed out
        setAuthState({
          ...defaultAuthState,
          isLoading: false,
        });
      }
    });

    return unsubscribe;
  }, []);

  // Expose resetPassword through context
  (AuthContext as any).resetPassword = resetPassword;

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
