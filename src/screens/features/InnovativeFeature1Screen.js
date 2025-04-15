import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useWord } from '../../context/WordContext';

const InnovativeFeature1Screen = ({ route, navigation }) => {
  const { listId, listName } = route.params;
  const { words, loading, fetchWords } = useWord();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  
  useEffect(() => {
    fetchWords(listId);
  }, [listId]);
  
  useEffect(() => {
    if (words.length > 0 && currentIndex >= words.length) {
      setSessionComplete(true);
    }
  }, [currentIndex, words]);
  
  const startListening = async () => {
    try {
      setIsListening(true);
      setRecognizedText('');
      setIsCorrect(null);
      
      // Simulating voice recognition since we can't use actual voice recognition in this environment
      setTimeout(() => {
        const currentWord = words[currentIndex];
        // Simulate 70% chance of correct recognition
        const isRecognitionCorrect = Math.random() < 0.7;
        
        if (isRecognitionCorrect) {
          setRecognizedText(currentWord.word);
          setIsCorrect(true);
          setScore(prev => prev + 1);
          playCorrectSound();
        } else {
          // Simulate a slightly wrong recognition
          setRecognizedText(simulateIncorrectRecognition(currentWord.word));
          setIsCorrect(false);
          playIncorrectSound();
        }
        
        setIsListening(false);
      }, 2000);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('Error', 'Failed to start voice recognition');
      setIsListening(false);
    }
  };
  
  const simulateIncorrectRecognition = (word) => {
    // Create a slightly incorrect version of the word
    const letters = word.split('');
    const randomIndex = Math.floor(Math.random() * letters.length);
    
    if (Math.random() < 0.5 && letters.length > 1) {
      // Remove a random letter
      letters.splice(randomIndex, 1);
    } else {
      // Change a random letter
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      letters[randomIndex] = randomLetter;
    }
    
    return letters.join('');
  };
  
  const playCorrectSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/correct.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  const playIncorrectSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/incorrect.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  const speakWord = async () => {
    if (words.length > 0 && currentIndex < words.length) {
      const currentWord = words[currentIndex];
      Speech.speak(currentWord.word, {
        language: 'en',
        pitch: 1.0,
        rate: 0.75
      });
    }
  };
  
  const handleNextWord = () => {
    setCurrentIndex(prev => prev + 1);
    setRecognizedText('');
    setIsCorrect(null);
  };
  
  const handleRestartSession = () => {
    setCurrentIndex(0);
    setRecognizedText('');
    setIsCorrect(null);
    setScore(0);
    setSessionComplete(false);
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
          <Ionicons name="mic-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No words to practice</Text>
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
  
  if (sessionComplete) {
    const percentage = Math.round((score / words.length) * 100);
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeContainer}>
          <Image
            source={require('../../../assets/voice-complete.png')}
            style={styles.successImage}
            resizeMode="contain"
          />
          <Text style={styles.completeTitle}>Practice Complete!</Text>
          <Text style={styles.completeScore}>
            Your score: {score}/{words.length}
          </Text>
          <Text style={[
            styles.completePercentage,
            percentage >= 80 ? styles.excellentScore :
            percentage >= 60 ? styles.goodScore :
            styles.needsWorkScore
          ]}>
            {percentage}%
          </Text>
          
          <Text style={styles.feedbackText}>
            {percentage >= 80 ? 'Excellent pronunciation!' :
             percentage >= 60 ? 'Good job! Keep practicing.' :
             'Keep practicing your pronunciation.'}
          </Text>
          
          <View style={styles.completeButtons}>
            <TouchableOpacity 
              style={[styles.completeButton, styles.restartButton]}
              onPress={handleRestartSession}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.completeButtonText}>Practice Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.completeButton, styles.learnButton]}
              onPress={() => navigation.navigate('LearningMode', { listId, listName })}
            >
              <Ionicons name="school" size={20} color="#fff" />
              <Text style={styles.completeButtonText}>Learn Mode</Text>
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
        <Text style={styles.title}>Voice Practice: {listName}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(currentIndex / words.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1}/{words.length}
          </Text>
        </View>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.instructionText}>Pronounce this word:</Text>
          <Text style={styles.wordText}>{currentWord.word}</Text>
          
          <TouchableOpacity 
            style={styles.speakButton}
            onPress={speakWord}
          >
            <Ionicons name="volume-high-outline" size={24} color="#5048E5" />
            <Text style={styles.speakButtonText}>Hear Pronunciation</Text>
          </TouchableOpacity>
          
          {currentWord.meaning && (
            <Text style={styles.meaningText}>Meaning: {currentWord.meaning}</Text>
          )}
          
          {isListening ? (
            <View style={styles.listeningContainer}>
              <ActivityIndicator size="large" color="#5048E5" />
              <Text style={styles.listeningText}>Listening...</Text>
            </View>
          ) : recognizedText ? (
            <View style={styles.resultContainer}>
              <Text style={styles.recognizedText}>You said: "{recognizedText}"</Text>
              <Text style={[
                styles.resultText,
                isCorrect ? styles.correctText : styles.incorrectText
              ]}>
                {isCorrect ? 'Correct!' : 'Try Again'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        {!isListening && !recognizedText && (
          <TouchableOpacity 
            style={styles.micButton}
            onPress={startListening}
          >
            <Ionicons name="mic" size={36} color="#fff" />
          </TouchableOpacity>
        )}
        
        {recognizedText && (
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNextWord}
          >
            <Text style={styles.nextButtonText}>Next Word</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.tipContainer}>
        <Text style={styles.tipText}>
          Tip: Speak clearly and at a normal pace for best results
        </Text>
      </View>
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
    marginBottom: 10,
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
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5048E5',
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
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  speakButtonText: {
    fontSize: 16,
    color: '#5048E5',
    marginLeft: 5,
  },
  meaningText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  listeningContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  listeningText: {
    fontSize: 16,
    color: '#5048E5',
    marginTop: 10,
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  recognizedText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  correctText: {
    color: '#4CAF50',
  },
  incorrectText: {
    color: '#e74c3c',
  },
  actionButtons: {
    alignItems: 'center',
    padding: 20,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5048E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  nextButton: {
    backgroundColor: '#5048E5',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipContainer: {
    padding: 20,
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
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
  completeScore: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  completePercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  excellentScore: {
    color: '#4CAF50',
  },
  goodScore: {
    color: '#FF9800',
  },
  needsWorkScore: {
    color: '#e74c3c',
  },
  feedbackText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
  learnButton: {
    backgroundColor: '#FF9800',
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

export default InnovativeFeature1Screen;
