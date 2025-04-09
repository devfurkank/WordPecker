import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Trophy, Zap } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.username}>Alex</Text>
        </View>

        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#7C3AED', '#6D28D9']}
            style={styles.streakCard}>
            <View style={styles.streakContent}>
              <Zap size={24} color="#FFFFFF" />
              <Text style={styles.streakDays}>7</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </LinearGradient>

          <View style={styles.statsCard}>
            <Trophy size={24} color="#7C3AED" />
            <Text style={styles.statsNumber}>156</Text>
            <Text style={styles.statsLabel}>Words Learned</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listScroll}>
            {[1, 2, 3].map((item) => (
              <TouchableOpacity key={item} style={styles.listCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800' }}
                  style={styles.listImage}
                />
                <View style={styles.listContent}>
                  <Text style={styles.listTitle}>Business English</Text>
                  <Text style={styles.listProgress}>12/30 words</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '40%' }]} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Challenge</Text>
            <ArrowRight size={20} color="#6B7280" />
          </View>

          <TouchableOpacity style={styles.challengeCard}>
            <LinearGradient
              colors={['rgba(124, 58, 237, 0.1)', 'rgba(124, 58, 237, 0.05)']}
              style={styles.challengeGradient}>
              <Text style={styles.challengeTitle}>Complete Today's Challenge</Text>
              <Text style={styles.challengeDescription}>
                Learn 5 new words and earn bonus points!
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  username: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#111827',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  streakCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  streakContent: {
    alignItems: 'center',
  },
  streakDays: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginTop: 8,
  },
  streakLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#111827',
    marginTop: 8,
  },
  statsLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#111827',
  },
  seeAll: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#7C3AED',
  },
  listScroll: {
    paddingLeft: 20,
  },
  listCard: {
    width: 280,
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
  listImage: {
    width: '100%',
    height: 140,
  },
  listContent: {
    padding: 16,
  },
  listTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  listProgress: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },
  challengeCard: {
    marginHorizontal: 20,
  },
  challengeGradient: {
    borderRadius: 16,
    padding: 20,
  },
  challengeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#7C3AED',
    marginBottom: 8,
  },
  challengeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
});