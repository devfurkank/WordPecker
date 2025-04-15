import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWord } from '../../context/WordContext';
import { useList } from '../../context/ListContext';

const LearningModeScreen = ({ route, navigation }) => {
  const { listId, listName } = route.params;
  const { words, loading, fetchWords, updateWordProgress } = useWord();
  const { updateList } = useList();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [learningComplete, setLearningComplete] = useState(false);
  const [learnedWords, setLearnedWords] = useState(0);
  
  useEffect(() => {
    fetchWords(listId);
  }, [listId]);
  
  useEffect(() => {
    if (words.length > 0 && currentIndex >= words.length) {
      setLearningComplete(true);
      updateListProgress();
    }
  }, [currentIndex, words]);
  
  const updateListProgress = async () => {
    try {
      await updateList(listId, {
        progress: {
          learnedWords: learnedWords,
          lastStudied: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error updating list progress:', error);
    }
  };
  
  const handleKnowWord = async () => {
    if (currentIndex < words.length) {
      const currentWord = words[currentIndex];
      
      try {
        // Update word progress
        const newProgress = {
          ...currentWord.progress,
          learned: true,
          lastReviewed: new Date().toISOString(),
          reviewCount: (currentWord.progress?.reviewCount || 0) + 1,
          correctCount: (currentWord.progress?.correctCount || 0) + 1
        };
        
        await updateWordProgress(currentWord.id, newProgress);
        
        // Update learned words count
        if (!currentWord.progress?.learned) {
          setLearnedWords(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error updating word progress:', error);
      }
      
      // Move to next word
      setCurrentIndex(prev => prev + 1);
      setShowMeaning(false);
      setSessionProgress(Math.round(((currentIndex + 1) / words.length) * 100));
    }
  };
  
  const handleStillLearningWord = () => {
    if (currentIndex < words.length) {
      // Move to next word without marking as learned
      setCurrentIndex(prev => prev + 1);
      setShowMeaning(false);
      setSessionProgress(Math.round(((currentIndex + 1) / words.length) * 100));
    }
  };
  
  const handleRevealMeaning = () => {
    setShowMeaning(true);
  };
  
  const handleRestartLearning = () => {
    setCurrentIndex(0);
    setShowMeaning(false);
    setSessionProgress(0);
    setLearningComplete(false);
    setLearnedWords(0);
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5048E5" />
        <Text style={styles.loadingText}>Loading words...</Text>
      </View>
    );
  }
  
  if (words.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No words to learn</Text>
          <Text style={styles.emptySubtext}>Add words to this list first</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddWords', { listId, listName })}
          >
            <Text style={styles.addButtonText}>Add Words</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  if (learningComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeContainer}>
          <Image
            source={require('../../../assets/success.png')}
            style={styles.successImage}
            resizeMode="contain"
          />
          <Text style={styles.completeTitle}>Learning Complete!</Text>
          <Text style={styles.completeStats}>
            You've reviewed {words.length} words
          </Text>
          <Text style={styles.completeLearnedStats}>
            {learnedWords} words marked as learned
          </Text>
          
          <View style={styles.completeButtons}>
            <TouchableOpacity 
              style={[styles.completeButton, styles.restartButton]}
              onPress={handleRestartLearning}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.completeButtonText}>Learn Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.completeButton, styles.testButton]}
              onPress={() => navigation.navigate('QuizMode', { listId, listName })}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.completeButtonText}>Take Quiz</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const currentWord = words[currentIndex];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning: {listName}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${sessionProgress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1}/{words.length}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.wordText}>{currentWord.word}</Text>
          
          {showMeaning ? (
            <View style={styles.meaningContainer}>
              <Text style={styles.meaningText}>{currentWord.meaning}</Text>
              {currentWord.context ? (
                <Text style={styles.contextText}>"{currentWord.context}"</Text>
              ) : null}
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.revealButton}
              onPress={handleRevealMeaning}
            >
              <Text style={styles.revealButtonText}>Reveal Meaning</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {showMeaning && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.stillLearningButton]}
            onPress={handleStillLearningWord}
          >
            <Ionicons name="refresh-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Still Learning</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.knowButton]}
            onPress={handleKnowWord}
          >
            <Ionicons name="checkmark-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>I Know This</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5048E5',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  meaningContainer: {
    width: '100%',
    alignItems: 'center',
  },
  meaningText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  contextText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  revealButton: {
    backgroundColor: '#5048E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  revealButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  stillLearningButton: {
    backgroundColor: '#FF9800',
  },
  knowButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#5048E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  successImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  completeStats: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  completeLearnedStats: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  completeButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  completeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  restartButton: {
    backgroundColor: '#5048E5',
  },
  testButton: {
    backgroundColor: '#4CAF50',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: '#5048E5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LearningModeScreen;
