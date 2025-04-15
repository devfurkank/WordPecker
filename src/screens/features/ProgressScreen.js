import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useList } from '../../context/ListContext';
import { useAuth } from '../../context/AuthContext';

const ProgressScreen = ({ navigation }) => {
  const { lists, loading, fetchLists } = useList();
  const { currentUser } = useAuth();
  const [totalWords, setTotalWords] = useState(0);
  const [learnedWords, setLearnedWords] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (lists.length > 0) {
      // Calculate total words and learned words
      let total = 0;
      let learned = 0;
      
      lists.forEach(list => {
        total += list.wordCount || 0;
        learned += list.progress?.learnedWords || 0;
      });
      
      setTotalWords(total);
      setLearnedWords(learned);
    }
  }, [lists]);

  const getProgressPercentage = () => {
    if (totalWords === 0) return 0;
    return Math.round((learnedWords / totalWords) * 100);
  };

  const renderListProgress = (list) => {
    const progressPercentage = list.wordCount > 0 
      ? Math.round((list.progress?.learnedWords || 0) / list.wordCount * 100) 
      : 0;
    
    return (
      <View key={list.id} style={styles.listProgressItem}>
        <View style={styles.listProgressHeader}>
          <Text style={styles.listName}>{list.name}</Text>
          <Text style={styles.listProgressText}>{progressPercentage}%</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.listProgressDetails}>
          <Text style={styles.listProgressDetailsText}>
            {list.progress?.learnedWords || 0} of {list.wordCount || 0} words learned
          </Text>
          <Text style={styles.listProgressDetailsText}>
            Last studied: {list.progress?.lastStudied ? new Date(list.progress.lastStudied).toLocaleDateString() : 'Never'}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5048E5" />
        <Text style={styles.loadingText}>Loading progress data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
        </View>

        <View style={styles.overallProgressContainer}>
          <View style={styles.progressCircleContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>{getProgressPercentage()}%</Text>
              <Text style={styles.progressLabel}>Overall</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalWords}</Text>
              <Text style={styles.statLabel}>Total Words</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{learnedWords}</Text>
              <Text style={styles.statLabel}>Learned</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lists.length}</Text>
              <Text style={styles.statLabel}>Lists</Text>
            </View>
          </View>
        </View>

        <View style={styles.listsProgressContainer}>
          <Text style={styles.sectionTitle}>Lists Progress</Text>
          
          {lists.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="list-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No lists yet</Text>
              <Text style={styles.emptySubtext}>Create your first list to start tracking progress</Text>
            </View>
          ) : (
            lists.map(renderListProgress)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const circleSize = width * 0.4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 20,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  overallProgressContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressCircleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressCircle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: '#5048E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressLabel: {
    fontSize: 14,
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  listsProgressContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  listProgressItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listProgressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5048E5',
  },
  progressBarContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5048E5',
  },
  listProgressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listProgressDetailsText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
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
  },
});

export default ProgressScreen;
