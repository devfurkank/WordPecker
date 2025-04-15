import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useList } from '../../context/ListContext';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { lists, loading, fetchLists, error } = useList();
  const { currentUser, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLists();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by the auth state listener in AuthContext
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  const renderListItem = ({ item }) => {
    const progressPercentage = item.wordCount > 0 
      ? Math.round((item.progress.learnedWords / item.wordCount) * 100) 
      : 0;
    
    return (
      <TouchableOpacity 
        style={styles.listItem}
        onPress={() => navigation.navigate('ListDetails', { listId: item.id, listName: item.name })}
      >
        <View style={styles.listItemContent}>
          <Text style={styles.listName}>{item.name}</Text>
          <Text style={styles.listDescription} numberOfLines={2}>{item.description}</Text>
          
          <View style={styles.listStats}>
            <Text style={styles.wordCount}>{item.wordCount} words</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progressPercentage}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{progressPercentage}%</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.listActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('LearningMode', { listId: item.id, listName: item.name })}
          >
            <Ionicons name="school-outline" size={20} color="#5048E5" />
            <Text style={styles.actionText}>Learn</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('QuizMode', { listId: item.id, listName: item.name })}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#5048E5" />
            <Text style={styles.actionText}>Test</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="list-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>No word lists yet</Text>
        <Text style={styles.emptySubtext}>Create your first list to start learning</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('Create')}
        >
          <Text style={styles.createButtonText}>Create List</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {currentUser?.displayName || 'User'}</Text>
          <Text style={styles.subtitle}>Your vocabulary lists</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#5048E5" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchLists}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={lists}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#5048E5']}
            />
          }
          ListHeaderComponent={
            loading && lists.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5048E5" />
                <Text style={styles.loadingText}>Loading your lists...</Text>
              </View>
            ) : null
          }
        />
      )}

      {!loading && lists.length > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('Create')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  listItemContent: {
    padding: 15,
  },
  listName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  listStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordCount: {
    fontSize: 12,
    color: '#888',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginRight: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5048E5',
  },
  progressText: {
    fontSize: 12,
    color: '#888',
  },
  listActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#5048E5',
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
  createButton: {
    backgroundColor: '#5048E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    color: '#5048E5',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5048E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default HomeScreen;
