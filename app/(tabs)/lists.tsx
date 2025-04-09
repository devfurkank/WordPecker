import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react-native';
import { router } from 'expo-router';

const INITIAL_LISTS = [
  {
    id: '1',
    title: 'Business English',
    description: 'Essential vocabulary for professional settings',
    wordCount: 30,
    progress: 40,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
  },
  {
    id: '2',
    title: 'Travel Phrases',
    description: 'Common expressions for travelers',
    wordCount: 50,
    progress: 75,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
  },
  {
    id: '3',
    title: 'Tech Terms',
    description: 'Modern technology vocabulary',
    wordCount: 45,
    progress: 20,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  },
];

export default function ListsScreen() {
  const [lists, setLists] = useState(INITIAL_LISTS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newList, setNewList] = useState({ title: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filteredLists = lists.filter(
    (list) =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateList = () => {
    if (newList.title.trim() === '') return;

    const newListItem = {
      id: (lists.length + 1).toString(),
      title: newList.title,
      description: newList.description,
      wordCount: 0,
      progress: 0,
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    };

    setLists([...lists, newListItem]);
    setNewList({ title: '', description: '' });
    setIsModalVisible(false);
  };

  const handleListPress = (listId: string) => {
    // Navigate to list details
    router.push(`/lists/${listId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Lists</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setIsSearchVisible(!isSearchVisible)}>
            <SearchIcon size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <SlidersHorizontal size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search lists..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}

      <ScrollView style={styles.content}>
        {filteredLists.map((list) => (
          <TouchableOpacity 
            key={list.id} 
            style={styles.listCard}
            onPress={() => handleListPress(list.id)}>
            <Image source={{ uri: list.image }} style={styles.listImage} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{list.title}</Text>
              <Text style={styles.listDescription}>{list.description}</Text>
              <View style={styles.listFooter}>
                <Text style={styles.wordCount}>{list.wordCount} words</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${list.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{list.progress}%</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New List</Text>
              <TouchableOpacity 
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="List Title"
              value={newList.title}
              onChangeText={(text) => setNewList({ ...newList, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={newList.description}
              onChangeText={(text) => setNewList({ ...newList, description: text })}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreateList}>
              <Text style={styles.createButtonText}>Create List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    fontFamily: 'Inter-Regular',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listImage: {
    width: '100%',
    height: 160,
  },
  listContent: {
    padding: 16,
  },
  listTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  listDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordCount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#374151',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#7C3AED',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});