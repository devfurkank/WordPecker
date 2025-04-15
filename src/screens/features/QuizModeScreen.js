import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWord } from '../../context/WordContext';
import { useList } from '../../context/ListContext';

const QuizModeScreen = ({ route, navigation }) => {
  const { listId, listName } = route.params;
  const { words, loading, fetchWords, updateWordProgress } = useWord();
  const { updateList } = useList();
  
  const [quizWords, setQuizWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  
  useEffect(() => {
    fetchWords(listId);
  }, [listId]);
  
  useEffect(() => {
    if (words.length > 0) {
      // Prepare quiz words - shuffle the array
      const shuffled = [...words].sort(() => 0.5 - Math.random());
      // Take up to 10 words for the quiz
      const selected = shuffled.slice(0, Math.min(10, shuffled.length));
      setQuizWords(selected);
      
      if (selected.length > 0) {
        generateOptions(selected, 0);
      }
    }
  }, [words]);
  
  useEffect(() => {
    if (quizWords.length > 0 && currentIndex >= quizWords.length) {
      setQuizComplete(true);
      updateListProgress();
    }
  }, [currentIndex, quizWords]);
  
  const updateListProgress = async () => {
    try {
      // Update last studied timestamp
      await updateList(listId, {
        progress: {
          ...words.progress,
          lastStudied: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error updating list progress:', error);
    }
  };
  
  const generateOptions = (wordsList, index) => {
    if (wordsList.length === 0) return;
    
    const correctWord = wordsList[index];
    
    // Get 3 random incorrect options
    const incorrectOptions = wordsList
      .filter(word => word.id !== correctWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(word => word.meaning);
    
    // Add correct option and shuffle
    const allOptions = [...incorrectOptions, correctWord.meaning]
      .sort(() => 0.5 - Math.random());
    
    setOptions(allOptions);
  };
  
  const handleSelectOption = (option) => {
    const currentWord = quizWords[currentIndex];
    const correct = option === currentWord.meaning;
    
    setSelectedOption(option);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
      
      // Update word progress
      updateWordProgress(currentWord.id, {
        ...currentWord.progress,
        lastReviewed: new Date().toISOString(),
        reviewCount: (currentWord.progress?.reviewCount || 0) + 1,
        correctCount: (currentWord.progress?.correctCount || 0) + 1
      }).catch(error => {
        console.error('Error updating word progress:', error);
      });
    } else {
      // Update word progress without incrementing correctCount
      updateWordProgress(currentWord.id, {
        ...currentWord.progress,
        lastReviewed: new Date().toISOString(),
        reviewCount: (currentWord.progress?.reviewCount || 0) + 1
      }).catch(error => {
        console.error('Error updating word progress:', error);
      });
    }
  };
  
  const handleNextQuestion = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setIsCorrect(null);
    setSessionProgress(Math.round((nextIndex / quizWords.length) * 100));
    
    if (nextIndex < quizWords.length) {
      generateOptions(quizWords, nextIndex);
    }
  };
  
  const handleRestartQuiz = () => {
    // Shuffle words again
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));
    setQuizWords(selected);
    
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setQuizComplete(false);
    setSessionProgress(0);
    
    if (selected.length > 0) {
      generateOptions(selected, 0);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5048E5" />
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }
  
  if (words.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No words to quiz</Text>
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
  
  if (quizComplete) {
    const percentage = Math.round((score / quizWords.length) * 100);
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeContainer}>
          <Image
            source={require('../../../assets/quiz-complete.png')}
            style={styles.successImage}
            resizeMode="contain"
          />
          <Text style={styles.completeTitle}>Quiz Complete!</Text>
          <Text style={styles.completeScore}>
            Your score: {score}/{quizWords.length}
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
            {percentage >= 80 ? 'Excellent! Keep up the good work!' :
             percentage >= 60 ? 'Good job! Practice more to improve.' :
             'Keep practicing! You\'ll get better.'}
          </Text>
          
          <View style={styles.completeButtons}>
            <TouchableOpacity 
              style={[styles.completeButton, styles.restartButton]}
              onPress={handleRestartQuiz}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.completeButtonText}>Try Again</Text>
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
  
  const currentWord = quizWords[currentIndex];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz: {listName}</Text>
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
            {currentIndex + 1}/{quizWords.length}
          </Text>
        </View>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>What is the meaning of:</Text>
        <Text style={styles.wordText}>{currentWord.word}</Text>
        
        {currentWord.context ? (
          <Text style={styles.contextText}>Context: "{currentWord.context}"</Text>
        ) : null}
      </View>
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && (
                isCorrect ? styles.correctOption : styles.incorrectOption
              ),
              selectedOption && selectedOption !== option && option === currentWord.meaning && styles.correctOption
            ]}
            onPress={() => selectedOption === null && handleSelectOption(option)}
            disabled={selectedOption !== null}
          >
            <Text style={[
              styles.optionText,
              selectedOption === option && (
                isCorrect ? styles.correctOptionText : styles.incorrectOptionText
              ),
              selectedOption && selectedOption !== option && option === currentWord.meaning && styles.correctOptionText
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {selectedOption !== null && (
        <View style={styles.feedbackContainer}>
          <Text style={[
            styles.feedbackText,
            isCorrect ? styles.correctFeedback : styles.incorrectFeedback
          ]}>
            {isCorrect ? 'Correct!' : 'Incorrect!'}
          </Text>
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.nextButtonText}>Next Question</Text>
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
  questionContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  contextText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  optionsContainer: {
    padding: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  correctOptionText: {
    color: '#fff',
  },
  incorrectOptionText: {
    color: '#fff',
  },
  feedbackContainer: {
    alignItems: 'center',
    padding: 20,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  correctFeedback: {
    color: '#4CAF50',
  },
  incorrectFeedback: {
    color: '#e74c3c',
  },
  nextButton: {
    backgroundColor: '#5048E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  completeButtons: {
    flexDirection: 'row',
    marginTop: 20,
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

export default QuizModeScreen;
