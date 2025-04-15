import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useWord } from '../../context/WordContext';

const InnovativeFeature2Screen = ({ route, navigation }) => {
  const { listId, listName } = route.params;
  const { words, loading, fetchWords } = useWord();
  
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  
  useEffect(() => {
    fetchWords(listId);
    
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, [listId]);
  
  useEffect(() => {
    if (words.length > 0 && currentIndex >= words.length) {
      setSessionComplete(true);
    }
  }, [currentIndex, words]);
  
  const handleScan = async () => {
    if (cameraRef) {
      try {
        setIsScanning(true);
        
        // Take a picture
        const photo = await cameraRef.takePictureAsync();
        
        // Resize the image to reduce processing time
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        
        // Simulate AR object recognition since we can't use actual AR in this environment
        setTimeout(() => {
          const currentWord = words[currentIndex];
          // Simulate 70% chance of correct recognition
          const isRecognitionCorrect = Math.random() < 0.7;
          
          if (isRecognitionCorrect) {
            setScanResult({
              word: currentWord.word,
              confidence: Math.random() * 20 + 80, // 80-100% confidence
              imageUri: manipResult.uri
            });
            setIsCorrect(true);
            setScore(prev => prev + 1);
          } else {
            // Simulate incorrect recognition
            setScanResult({
              word: getRandomIncorrectWord(currentWord.word),
              confidence: Math.random() * 40 + 40, // 40-80% confidence
              imageUri: manipResult.uri
            });
            setIsCorrect(false);
          }
          
          setIsScanning(false);
        }, 2000);
      } catch (error) {
        console.error('Error scanning object:', error);
        Alert.alert('Error', 'Failed to scan object');
        setIsScanning(false);
      }
    }
  };
  
  const getRandomIncorrectWord = (correctWord) => {
    // Return a random word from the list that is not the correct one
    const otherWords = words
      .filter(w => w.word !== correctWord)
      .map(w => w.word);
    
    if (otherWords.length > 0) {
      return otherWords[Math.floor(Math.random() * otherWords.length)];
    } else {
      // If no other words, return a modified version of the correct word
      return correctWord + 's';
    }
  };
  
  const handleNextWord = () => {
    setCurrentIndex(prev => prev + 1);
    setScanResult(null);
    setIsCorrect(null);
  };
  
  const handleRestartSession = () => {
    setCurrentIndex(0);
    setScanResult(null);
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
  
  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="camera-off-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>No access to camera</Text>
        <Text style={styles.emptySubtext}>Camera permission is required for AR Word Learning</Text>
      </View>
    );
  }
  
  if (words.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="camera-outline" size={60} color="#ccc" />
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
            source={require('../../../assets/ar-complete.png')}
            style={styles.successImage}
            resizeMode="contain"
          />
          <Text style={styles.completeTitle}>AR Learning Complete!</Text>
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
            {percentage >= 80 ? 'Excellent object recognition!' :
             percentage >= 60 ? 'Good job! Keep practicing.' :
             'Keep practicing with real objects.'}
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
        <Text style={styles.title}>AR Word Learning: {listName}</Text>
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
      
      <View style={styles.wordContainer}>
        <Text style={styles.instructionText}>Find and scan this object:</Text>
        <Text style={styles.wordText}>{currentWord.word}</Text>
        {currentWord.meaning && (
          <Text style={styles.meaningText}>Meaning: {currentWord.meaning}</Text>
        )}
      </View>
      
      {scanResult ? (
        <View style={styles.resultContainer}>
          <Image 
            source={{ uri: scanResult.imageUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          
          <View style={styles.recognitionResult}>
            <Text style={styles.recognizedText}>Recognized: "{scanResult.word}"</Text>
            <Text style={styles.confidenceText}>Confidence: {scanResult.confidence.toFixed(1)}%</Text>
            <Text style={[
              styles.resultText,
              isCorrect ? styles.correctText : styles.incorrectText
            ]}>
              {isCorrect ? 'Correct!' : 'Try Again'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNextWord}
          >
            <Text style={styles.nextButtonText}>Next Word</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={ref => setCameraRef(ref)}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.scanFrame} />
            </View>
          </Camera>
          
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={handleScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Ionicons name="scan" size={36} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.tipContainer}>
        <Text style={styles.tipText}>
          Tip: Hold your camera steady and ensure good lighting for best results
        </Text>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const cameraSize = width - 40;

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
  wordContainer: {
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
  instructionText: {
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
  meaningText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  cameraContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  camera: {
    width: cameraSize,
    height: cameraSize,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: cameraSize * 0.7,
    height: cameraSize * 0.7,
    borderWidth: 2,
    borderColor: '#5048E5',
    borderRadius: 10,
  },
  scanButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#5048E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resultContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  previewImage: {
    width: cameraSize,
    height: cameraSize * 0.7,
    borderRadius: 10,
    marginBottom: 15,
  },
  recognitionResult: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recognizedText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 14,
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

export default InnovativeFeature2Screen;
