import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWord } from '../../context/WordContext';
import { useList } from '../../context/ListContext';

const ListDetailsScreen = ({ route, navigation }) => {
  const { listId, listName } = route.params;
  const [list, setList] = useState(null);
  const { words, loading, fetchWords, deleteWord } = useWord();
  const { lists, fetchLists, updateList, deleteList } = useList();

  useEffect(() => {
    // Fetch words for this specific list
    if (listId) {
      fetchWords(listId);
    }
    
    // Find the current list from lists
    if (lists && listId) {
      const currentList = lists.find(l => l.id === listId);
      if (currentList) {
        setList(currentList);
      }
    }
  }, [listId, lists]);

  const handleDeleteWord = (wordId) => {
    Alert.alert(
      'Delete Word',
      'Are you sure you want to delete this word?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWord(wordId, listId);
              fetchLists(); // Refresh lists to update word count
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list? All words in this list will be deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteList(listId);
              navigation.navigate('Home');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderWordItem = ({ item }) => (
    <View style={styles.wordItem}>
      <View style={styles.wordContent}>
        <Text style={styles.wordText}>{item.word}</Text>
        <Text style={styles.meaningText}>{item.meaning}</Text>
        {item.context ? (
          <Text style={styles.contextText}>"{item.context}"</Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteWord(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyList = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="book-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>No words in this list</Text>
        <Text style={styles.emptySubtext}>Add words to start learning</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddWords', { listId, listName })}
        >
          <Text style={styles.addButtonText}>Add Words</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!list) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5048E5" />
      </View>
    );
  }

  // Ensure words is an array
  const wordsList = words || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{listName}</Text>
        <Text style={styles.subtitle}>{list.description}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{wordsList.length}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {list.progress?.learnedWords || 0}
            </Text>
            <Text style={styles.statLabel}>Learned</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {wordsList.length > 0 
                ? Math.round(((list.progress?.learnedWords || 0) / wordsList.length) * 100) 
                : 0}%
            </Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.learnButton]}
          onPress={() => navigation.navigate('LearningMode', { listId, listName })}
        >
          <Ionicons name="school-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Learn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.testButton]}
          onPress={() => navigation.navigate('QuizMode', { listId, listName })}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.addWordsButton]}
          onPress={() => navigation.navigate('AddWords', { listId, listName })}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Add Words</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.wordsContainer}>
        <View style={styles.wordsHeader}>
          <Text style={styles.wordsTitle}>Words</Text>
          <Text style={styles.wordsCount}>{wordsList.length} total</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWordsContainer}>
            <ActivityIndicator size="large" color="#5048E5" />
            <Text style={styles.loadingText}>Loading words...</Text>
          </View>
        ) : (
          <FlatList
            data={wordsList}
            renderItem={renderWordItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyList}
            contentContainerStyle={styles.wordsList}
          />
        )}
      </View>

      <TouchableOpacity 
        style={styles.deleteListButton}
        onPress={handleDeleteList}
      >
        <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        <Text style={styles.deleteListText}>Delete List</Text>
      </TouchableOpacity>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5048E5',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  learnButton: {
    backgroundColor: '#5048E5',
  },
  testButton: {
    backgroundColor: '#4CAF50',
  },
  addWordsButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  wordsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  wordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  wordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  wordsCount: {
    fontSize: 14,
    color: '#666',
  },
  wordsList: {
    padding: 15,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  wordContent: {
    flex: 1,
  },
  wordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  meaningText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  contextText: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
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
  loadingWordsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  deleteListButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  deleteListText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default ListDetailsScreen;
