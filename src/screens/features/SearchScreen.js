import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useList } from '../../context/ListContext';
import { useWord } from '../../context/WordContext';

const SearchScreen = ({ navigation }) => {
  const { lists, loading: listsLoading } = useList();
  const { words: allWords, loading: wordsLoading, fetchAllWords } = useWord();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'lists', 'words'

  // Fetch all words when component mounts
  useEffect(() => {
    fetchAllWords();
  }, []);

  useEffect(() => {
    // Load recent searches from storage
    // This would typically use AsyncStorage in a real app
    const loadRecentSearches = async () => {
      // Placeholder for demo
      setRecentSearches(['vocabulary', 'english', 'grammar']);
    };

    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Perform search
    const query = searchQuery.toLowerCase().trim();
    const results = [];

    // Search in lists
    if ((activeFilter === 'all' || activeFilter === 'lists') && lists) {
      const matchedLists = lists.filter(list => 
        list.name.toLowerCase().includes(query) || 
        (list.description && list.description.toLowerCase().includes(query))
      );

      matchedLists.forEach(list => {
        results.push({
          id: list.id,
          type: 'list',
          name: list.name,
          description: list.description || '',
          data: list
        });
      });
    }

    // Search in words
    if ((activeFilter === 'all' || activeFilter === 'words') && allWords) {
      const matchedWords = allWords.filter(word => 
        word.word.toLowerCase().includes(query) || 
        word.meaning.toLowerCase().includes(query) ||
        (word.context && word.context.toLowerCase().includes(query))
      );

      matchedWords.forEach(word => {
        // Find the list this word belongs to
        const parentList = lists ? lists.find(list => list.id === word.listId) : null;
        
        results.push({
          id: word.id,
          type: 'word',
          name: word.word,
          description: word.meaning,
          context: word.context,
          listId: word.listId,
          listName: parentList ? parentList.name : 'Unknown List',
          data: word
        });
      });
    }

    setSearchResults(results);
    setIsSearching(false);

    // Add to recent searches if not already there
    if (query.length > 2 && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  }, [searchQuery, lists, allWords, activeFilter]);

  const handleItemPress = (item) => {
    if (item.type === 'list') {
      navigation.navigate('ListDetails', { 
        listId: item.id, 
        listName: item.name 
      });
    } else if (item.type === 'word') {
      navigation.navigate('ListDetails', { 
        listId: item.listId, 
        listName: item.listName 
      });
    }
  };

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.searchResultItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.searchResultIconContainer}>
        <Ionicons 
          name={item.type === 'list' ? 'list' : 'text'} 
          size={24} 
          color="#5048E5" 
        />
      </View>
      <View style={styles.searchResultContent}>
        <Text style={styles.searchResultName}>{item.name}</Text>
        <Text style={styles.searchResultDescription}>{item.description}</Text>
        {item.type === 'word' && item.context && (
          <Text style={styles.searchResultContext}>"{item.context}"</Text>
        )}
        {item.type === 'word' && (
          <Text style={styles.searchResultListName}>List: {item.listName}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }) => (
    <TouchableOpacity 
      style={styles.recentSearchItem}
      onPress={() => setSearchQuery(item)}
    >
      <Ionicons name="time-outline" size={16} color="#666" />
      <Text style={styles.recentSearchText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderEmptyResult = () => {
    if (isSearching || searchQuery.trim() === '') return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>No results found</Text>
        <Text style={styles.emptySubtext}>Try a different search term or filter</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search lists and words..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              activeFilter === 'all' && styles.activeFilterButton
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[
              styles.filterButtonText,
              activeFilter === 'all' && styles.activeFilterButtonText
            ]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              activeFilter === 'lists' && styles.activeFilterButton
            ]}
            onPress={() => setActiveFilter('lists')}
          >
            <Text style={[
              styles.filterButtonText,
              activeFilter === 'lists' && styles.activeFilterButtonText
            ]}>Lists</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              activeFilter === 'words' && styles.activeFilterButton
            ]}
            onPress={() => setActiveFilter('words')}
          >
            <Text style={[
              styles.filterButtonText,
              activeFilter === 'words' && styles.activeFilterButtonText
            ]}>Words</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isSearching || wordsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5048E5" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : searchQuery.trim() === '' ? (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
          <FlatList
            data={recentSearches}
            renderItem={renderRecentSearch}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <Text style={styles.noRecentSearchesText}>No recent searches</Text>
            }
          />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={styles.searchResultsList}
          ListEmptyComponent={renderEmptyResult}
        />
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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    padding: 20,
    paddingTop: 0,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  activeFilterButton: {
    backgroundColor: '#5048E5',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  recentSearchesContainer: {
    padding: 20,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  noRecentSearchesText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  searchResultsList: {
    padding: 20,
  },
  searchResultItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchResultIconContainer: {
    marginRight: 15,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  searchResultDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  searchResultContext: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  searchResultListName: {
    fontSize: 12,
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
  },
});

export default SearchScreen;
