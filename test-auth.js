// Test script for authentication functionality
import { auth, db } from './src/firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'Test123456',
  displayName: 'Test User'
};

// Test registration
const testRegister = async () => {
  try {
    console.log('Testing registration...');
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      testUser.email, 
      testUser.password
    );
    const user = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: testUser.email,
      displayName: testUser.displayName,
      createdAt: new Date().toISOString(),
      lists: [],
      progress: {
        totalWords: 0,
        learnedWords: 0,
        streak: 0,
        lastActivity: new Date().toISOString()
      }
    });
    
    console.log('Registration successful:', user.uid);
    return user;
  } catch (error) {
    console.error('Registration failed:', error.message);
    // If user already exists, we can continue with tests
    if (error.code === 'auth/email-already-in-use') {
      console.log('User already exists, continuing with tests...');
      return null;
    }
    throw error;
  }
};

// Test login
const testLogin = async () => {
  try {
    console.log('Testing login...');
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      testUser.email, 
      testUser.password
    );
    console.log('Login successful:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
};

// Test password reset
const testPasswordReset = async () => {
  try {
    console.log('Testing password reset...');
    await sendPasswordResetEmail(auth, testUser.email);
    console.log('Password reset email sent successfully');
    return true;
  } catch (error) {
    console.error('Password reset failed:', error.message);
    throw error;
  }
};

// Test logout
const testLogout = async () => {
  try {
    console.log('Testing logout...');
    await signOut(auth);
    console.log('Logout successful');
    return true;
  } catch (error) {
    console.error('Logout failed:', error.message);
    throw error;
  }
};

// Run all tests
const runTests = async () => {
  try {
    // Register test user (or continue if already exists)
    await testRegister();
    
    // Login with test user
    const user = await testLogin();
    
    // Test password reset
    await testPasswordReset();
    
    // Test logout
    await testLogout();
    
    console.log('All authentication tests passed successfully!');
  } catch (error) {
    console.error('Test suite failed:', error);
  }
};

// Execute tests
runTests();
