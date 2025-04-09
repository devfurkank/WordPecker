import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, History, Bookmark, ArrowRight, X } from 'lucide-react-native';
import { router } from 'expo-router';

const INITIAL_RECENT_SEARCHES = ['business', 'travel', 'technology'];
const SUGGESTED_LISTS = [
  { id: '1', title: 'Common Business Terms', count: 50 },
  { id: '2', title: 'Travel Essentials', count: 30 },
  { id: '3', title: 'Tech Vocabulary', count: 45 },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const [searchResults, setSearchResults] = useState<typeof SUGGESTED_LISTS>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    // Simulate search API call
    setTimeout(() => {
      const results = SUGGESTED_LISTS.filter(
        list => list.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);

      // Add to recent searches if not already present
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev].slice(0, 5));
      }
    }, 500);
  }, [searchQuery, recentSearches]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  const handleListPress = (listId: string) => {
    router.push(`/lists/${listId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search words or lists..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {searchResults.map((list) => (
              <TouchableOpacity 
                key={list.id} 
                style={styles.listItem}
                onPress={() => handleListPress(list.id)}>
                <View>
                  <Text style={styles.listTitle}>{list.title}</Text>
                  <Text style={styles.listCount}>{list.count} words</Text>
                </View>
                <ArrowRight size={20} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <History size={20} color="#6B7280" />
                <Text style={styles.sectionTitle}>Recent Searches</Text>
              </View>
              <View style={styles.recentSearches}>
                {recentSearches.map((search) => (
                  <View key={search} style={styles.recentSearchWrapper}>
                    <TouchableOpacity 
                      style={styles.recentSearchItem}
                      onPress={() => {
                        setSearchQuery(search);
                        handleSearch();
                      }}>
                      <Text style={styles.recentSearchText}>{search}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => removeRecentSearch(search)}
                      style={styles.removeSearch}>
                      <X size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Bookmark size={20} color="#6B7280" />
                <Text style={styles.sectionTitle}>Suggested Lists</Text>
              </View>
              {SUGGESTED_LISTS.map((list) => (
                <TouchableOpacity 
                  key={list.id} 
                  style={styles.listItem}
                  onPress={() => handleListPress(list.id)}>
                  <View>
                    <Text style={styles.listTitle}>{list.title}</Text>
                    <Text style={styles.listCount}>{list.count} words</Text>
                  </View>
                  <ArrowRight size={20} color="#6B7280" />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  recentSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentSearchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentSearchItem: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recentSearchText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#374151',
  },
  removeSearch: {
    marginLeft: 4,
    padding: 4,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  listCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
});