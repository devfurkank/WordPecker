import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const WordContext = createContext();

export const useWord = () => useContext(WordContext);

export const WordProvider = ({ children }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  // Fetch all words for a specific list
  const fetchWords = async (listId) => {
    if (!currentUser || !listId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const q = query(collection(db, 'words'), where('listId', '==', listId));
      const querySnapshot = await getDocs(q);
      
      const wordsData = [];
      querySnapshot.forEach((doc) => {
        wordsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setWords(wordsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching words:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new word to a list
  const addWord = async (listId, wordData) => {
    try {
      setError('');
      
      const newWord = {
        ...wordData,
        listId,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        progress: {
          learned: false,
          lastReviewed: null,
          reviewCount: 0,
          correctCount: 0
        }
      };
      
      const docRef = await addDoc(collection(db, 'words'), newWord);
      
      // Update local state
      setWords(prevWords => [...prevWords, { id: docRef.id, ...newWord }]);
      
      // Update word count in the list
      const listRef = doc(db, 'lists', listId);
      await updateDoc(listRef, {
        wordCount: words.length + 1,
        updatedAt: new Date().toISOString()
      });
      
      return docRef.id;
    } catch (err) {
      setError(err.message);
      console.error('Error adding word:', err);
      throw err;
    }
  };

  // Update an existing word
  const updateWord = async (wordId, updatedData) => {
    try {
      setError('');
      
      const wordRef = doc(db, 'words', wordId);
      await updateDoc(wordRef, updatedData);
      
      // Update local state
      setWords(prevWords => 
        prevWords.map(word => 
          word.id === wordId 
            ? { ...word, ...updatedData } 
            : word
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error updating word:', err);
      throw err;
    }
  };

  // Delete a word
  const deleteWord = async (wordId, listId) => {
    try {
      setError('');
      
      await deleteDoc(doc(db, 'words', wordId));
      
      // Update local state
      const updatedWords = words.filter(word => word.id !== wordId);
      setWords(updatedWords);
      
      // Update word count in the list
      const listRef = doc(db, 'lists', listId);
      await updateDoc(listRef, {
        wordCount: updatedWords.length,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message);
      console.error('Error deleting word:', err);
      throw err;
    }
  };

  // Update word learning progress
  const updateWordProgress = async (wordId, progressData) => {
    try {
      setError('');
      
      const wordRef = doc(db, 'words', wordId);
      await updateDoc(wordRef, {
        progress: progressData
      });
      
      // Update local state
      setWords(prevWords => 
        prevWords.map(word => 
          word.id === wordId 
            ? { ...word, progress: progressData } 
            : word
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error updating word progress:', err);
      throw err;
    }
  };

  const value = {
    words,
    loading,
    error,
    fetchWords,
    addWord,
    updateWord,
    deleteWord,
    updateWordProgress
  };

  return (
    <WordContext.Provider value={value}>
      {children}
    </WordContext.Provider>
  );
};
