import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Moon,
  Globe,
  Download,
  Upload,
  Trash2,
  LogOut,
  ChevronRight,
  User,
} from 'lucide-react-native';
import { router } from 'expo-router';

const SETTINGS_SECTIONS = [
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', icon: Bell, title: 'Notifications', type: 'switch' },
      { id: 'darkMode', icon: Moon, title: 'Dark Mode', type: 'switch' },
      { id: 'language', icon: Globe, title: 'Language', value: 'English', type: 'select' },
    ],
  },
  {
    title: 'Data',
    items: [
      { id: 'export', icon: Download, title: 'Export Data', type: 'button' },
      { id: 'import', icon: Upload, title: 'Import Data', type: 'button' },
      { id: 'delete', icon: Trash2, title: 'Delete Account', type: 'button', danger: true },
    ],
  },
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'English',
  });

  const handleToggle = (settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId as keyof typeof prev],
    }));
  };

  const handleLanguageSelect = () => {
    // Navigate to language selection screen
    router.push('/settings/language');
  };

  const handleProfilePress = () => {
    // Navigate to profile screen
    router.push('/settings/profile');
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be exported as a JSON file',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export',
          onPress: () => {
            // Implement export functionality
            Alert.alert('Success', 'Data exported successfully');
          }
        }
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'This will replace your current data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: () => {
            // Implement import functionality
            Alert.alert('Success', 'Data imported successfully');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement account deletion
            router.replace('/auth');
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // Implement logout
            router.replace('/auth');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <TouchableOpacity 
          style={styles.profileCard}
          onPress={handleProfilePress}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <User size={24} color="#7C3AED" />
            </View>
            <View>
              <Text style={styles.profileName}>Alex Johnson</Text>
              <Text style={styles.profileEmail}>alex@example.com</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#6B7280" />
        </TouchableOpacity>

        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.settingItem, item.danger && styles.dangerItem]}
                    onPress={() => {
                      if (item.id === 'language') handleLanguageSelect();
                      else if (item.id === 'export') handleExportData();
                      else if (item.id === 'import') handleImportData();
                      else if (item.id === 'delete') handleDeleteAccount();
                    }}>
                    <View style={styles.settingItemLeft}>
                      <Icon size={20} color={item.danger ? '#EF4444' : '#6B7280'} />
                      <Text
                        style={[
                          styles.settingItemTitle,
                          item.danger && styles.dangerItemTitle,
                        ]}>
                        {item.title}
                      </Text>
                    </View>
                    {item.type === 'switch' && (
                      <Switch
                        value={settings[item.id as keyof typeof settings] as boolean}
                        onValueChange={() => handleToggle(item.id)}
                      />
                    )}
                    {item.type === 'select' && (
                      <View style={styles.settingItemRight}>
                        <Text style={styles.settingItemValue}>{item.value}</Text>
                        <ChevronRight size={20} color="#6B7280" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    fontSize: 24,
    color: '#111827',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerItemTitle: {
    color: '#EF4444',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 20,
    padding: 16,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 8,
  },
});