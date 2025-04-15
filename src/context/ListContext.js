import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const ListContext = createContext();

export const useList = () => useContext(ListContext);

export const ListProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  // Fetch all lists for the current user
  const fetchLists = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError('');
      
      const q = query(collection(db, 'lists'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const listsData = [];
      querySnapshot.forEach((doc) => {
        listsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setLists(listsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching lists:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new list
  const createList = async (listData) => {
    try {
      setError('');
      
      const newList = {
        ...listData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: 0,
        progress: {
          learnedWords: 0,
          lastStudied: null
        }
      };
      
      const docRef = await addDoc(collection(db, 'lists'), newList);
      
      // Update local state
      setLists(prevLists => [...prevLists, { id: docRef.id, ...newList }]);
      
      return docRef.id;
    } catch (err) {
      setError(err.message);
      console.error('Error creating list:', err);
      throw err;
    }
  };

  // Update an existing list
  const updateList = async (listId, updatedData) => {
    try {
      setError('');
      
      const listRef = doc(db, 'lists', listId);
      await updateDoc(listRef, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setLists(prevLists => 
        prevLists.map(list => 
          list.id === listId 
            ? { ...list, ...updatedData, updatedAt: new Date().toISOString() } 
            : list
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error updating list:', err);
      throw err;
    }
  };

  // Delete a list
  const deleteList = async (listId) => {
    try {
      setError('');
      
      await deleteDoc(doc(db, 'lists', listId));
      
      // Update local state
      setLists(prevLists => prevLists.filter(list => list.id !== listId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting list:', err);
      throw err;
    }
  };

  // Fetch lists when user changes
  useEffect(() => {
    if (currentUser) {
      fetchLists();
    } else {
      setLists([]);
    }
  }, [currentUser]);

  const value = {
    lists,
    loading,
    error,
    fetchLists,
    createList,
    updateList,
    deleteList
  };

  return (
    <ListContext.Provider value={value}>
      {children}
    </ListContext.Provider>
  );
};
