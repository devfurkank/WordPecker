// Test Firebase permissions
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './src/firebase/config';

const testFirebasePermissions = async () => {
  try {
    console.log('Starting Firebase permissions test...');
    
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('No user is signed in. Please sign in first.');
      return;
    }
    
    console.log(`Testing as user: ${user.email} (${user.uid})`);
    
    // Test 1: Read user document
    console.log('\nTest 1: Reading user document...');
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      console.log('User document read success:', userDoc.exists());
    } catch (error) {
      console.error('User document read failed:', error);
    }
    
    // Test 2: Read all lists (should work with new rules)
    console.log('\nTest 2: Reading all lists...');
    try {
      const listsSnapshot = await getDocs(collection(db, 'lists'));
      console.log('Lists read success. Count:', listsSnapshot.size);
    } catch (error) {
      console.error('Lists read failed:', error);
    }
    
    // Test 3: Read user's lists
    console.log('\nTest 3: Reading user\'s lists...');
    try {
      const q = query(collection(db, 'lists'), where('userId', '==', user.uid));
      const listsSnapshot = await getDocs(q);
      console.log('User lists read success. Count:', listsSnapshot.size);
    } catch (error) {
      console.error('User lists read failed:', error);
    }
    
    // Test 4: Read all words (should work with new rules)
    console.log('\nTest 4: Reading all words...');
    try {
      const wordsSnapshot = await getDocs(collection(db, 'words'));
      console.log('Words read success. Count:', wordsSnapshot.size);
    } catch (error) {
      console.error('Words read failed:', error);
    }
    
    // Test 5: Read words for a specific list
    console.log('\nTest 5: Reading words for a specific list...');
    try {
      // First get a list ID
      const q = query(collection(db, 'lists'), where('userId', '==', user.uid));
      const listsSnapshot = await getDocs(q);
      
      if (listsSnapshot.empty) {
        console.log('No lists found to test with.');
      } else {
        const listId = listsSnapshot.docs[0].id;
        console.log('Testing with list ID:', listId);
        
        const wordsQuery = query(collection(db, 'words'), where('listId', '==', listId));
        const wordsSnapshot = await getDocs(wordsQuery);
        console.log('List words read success. Count:', wordsSnapshot.size);
      }
    } catch (error) {
      console.error('List words read failed:', error);
    }
    
    console.log('\nFirebase permissions test completed.');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
};

// Export the test function
export default testFirebasePermissions;
