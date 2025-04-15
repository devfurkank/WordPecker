import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useList } from '../../context/ListContext';

const CreateListScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [source, setSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createList, error } = useList();

  const handleCreateList = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    try {
      setIsLoading(true);
      
      const listData = {
        name,
        description,
        language,
        source,
      };
      
      const listId = await createList(listData);
      
      Alert.alert(
        'Success',
        'List created successfully',
        [
          {
            text: 'Add Words Now',
            onPress: () => navigation.navigate('AddWords', { listId, listName: name }),
          },
          {
            text: 'Later',
            onPress: () => navigation.navigate('Home'),
            style: 'cancel',
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Create New List</Text>
            <Text style={styles.subtitle}>Create a new vocabulary list to start learning</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>List Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter list name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter list description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Language</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter language (e.g., English, Spanish)"
                value={language}
                onChangeText={setLanguage}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Source (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter source (e.g., book, article)"
                value={source}
                onChangeText={setSource}
              />
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateList}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.createButtonText}>Create List</Text>
              )}
            </TouchableOpacity>
          </View>
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
    fontSize: 24,
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
  },
  inputContainer: {
    marginBottom: 20,
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
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#5048E5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateListScreen;
