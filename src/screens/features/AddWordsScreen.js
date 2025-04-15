import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWord } from '../../context/WordContext';
import { useList } from '../../context/ListContext';

const AddWordsScreen = ({ route, navigation }) => {
  const { listId, listName } = route.params;
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const { addWord, fetchWords, words } = useWord();
  const { fetchLists } = useList();

  useEffect(() => {
    fetchWords(listId);
  }, [listId]);

  const handleAddWord = async () => {
    if (!word || !meaning) {
      Alert.alert('Error', 'Please enter both word and meaning');
      return;
    }

    try {
      setIsLoading(true);
      
      const wordData = {
        word: word.trim(),
        meaning: meaning.trim(),
        context: context.trim(),
      };
      
      await addWord(listId, wordData);
      
      // Add to recently added list
      setRecentlyAdded(prev => [wordData, ...prev]);
      
      // Clear form
      setWord('');
      setMeaning('');
      setContext('');
      
      // Refresh lists to update word count
      fetchLists();
      
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRecentItem = ({ item, index }) => (
    <View style={styles.recentItem}>
      <View style={styles.recentItemHeader}>
        <Text style={styles.recentItemWord}>{item.word}</Text>
        <Text style={styles.recentItemNumber}>#{recentlyAdded.length - index}</Text>
      </View>
      <Text style={styles.recentItemMeaning}>{item.meaning}</Text>
      {item.context ? (
        <Text style={styles.recentItemContext}>"{item.context}"</Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Words to "{listName}"</Text>
            <Text style={styles.subtitle}>Current word count: {words.length}</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Word *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter word"
                value={word}
                onChangeText={setWord}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Meaning *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter meaning"
                value={meaning}
                onChangeText={setMeaning}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Context Example (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter a sentence using this word"
                value={context}
                onChangeText={setContext}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddWord}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Add Word</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {recentlyAdded.length > 0 && (
            <View style={styles.recentContainer}>
              <Text style={styles.recentTitle}>Recently Added</Text>
              <FlatList
                data={recentlyAdded}
                renderItem={renderRecentItem}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#5048E5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  recentContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  recentItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  recentItemWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recentItemNumber: {
    fontSize: 12,
    color: '#888',
  },
  recentItemMeaning: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  recentItemContext: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddWordsScreen;
