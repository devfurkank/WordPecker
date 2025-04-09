import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brain, GraduationCap, Trophy, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const MODES = [
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Review words with interactive flashcards',
    icon: Brain,
    color: '#EC4899',
  },
  {
    id: 'quiz',
    title: 'Quiz Mode',
    description: 'Test your knowledge with multiple choice questions',
    icon: GraduationCap,
    color: '#7C3AED',
  },
  {
    id: 'challenge',
    title: 'Daily Challenge',
    description: 'Complete daily tasks to earn rewards',
    icon: Trophy,
    color: '#F59E0B',
  },
];

const RECENT_ACTIVITIES = [
  {
    id: '1',
    title: 'Business English',
    wordsLearned: 15,
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
  },
  {
    id: '2',
    title: 'Travel Phrases',
    wordsLearned: 20,
    time: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
  },
  {
    id: '3',
    title: 'Tech Terms',
    wordsLearned: 10,
    time: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  },
];

export default function LearnScreen() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    // Navigate to the selected learning mode
    router.push(`/learn/${modeId}`);
  };

  const handleActivityPress = (activityId: string) => {
    // Navigate to activity details
    router.push(`/learn/activity/${activityId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.subtitle}>Choose your learning mode</Text>
        </View>

        <View style={styles.modesContainer}>
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <TouchableOpacity 
                key={mode.id} 
                style={styles.modeCard}
                onPress={() => handleModeSelect(mode.id)}>
                <LinearGradient
                  colors={[`${mode.color}15`, `${mode.color}05`]}
                  style={styles.modeGradient}>
                  <View style={[styles.iconContainer, { backgroundColor: `${mode.color}15` }]}>
                    <Icon size={24} color={mode.color} />
                  </View>
                  <Text style={styles.modeTitle}>{mode.title}</Text>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.activityScroll}>
            {RECENT_ACTIVITIES.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityCard}
                onPress={() => handleActivityPress(activity.id)}>
                <Image
                  source={{ uri: activity.image }}
                  style={styles.activityImage}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityStats}>{activity.wordsLearned} words learned</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedMode && (
          <View style={styles.selectedModeIndicator}>
            <Text style={styles.selectedModeText}>
              Selected: {MODES.find(m => m.id === selectedMode)?.title}
            </Text>
            <TouchableOpacity 
              onPress={() => setSelectedMode(null)}
              style={styles.clearSelection}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#111827',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  modesContainer: {
    padding: 20,
    gap: 16,
  },
  modeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modeGradient: {
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modeTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 8,
  },
  modeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  activityScroll: {
    paddingLeft: 20,
  },
  activityCard: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityImage: {
    width: '100%',
    height: 120,
  },
  activityContent: {
    padding: 16,
  },
  activityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  activityStats: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7C3AED',
    marginTop: 4,
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  selectedModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    margin: 20,
    padding: 12,
    borderRadius: 8,
  },
  selectedModeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#374151',
  },
  clearSelection: {
    padding: 4,
  },
});