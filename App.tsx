import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';

// Feature Screens
import HomeScreen from './src/screens/features/HomeScreen';
import CreateListScreen from './src/screens/features/CreateListScreen';
import AddWordsScreen from './src/screens/features/AddWordsScreen';
import ListDetailsScreen from './src/screens/features/ListDetailsScreen';
import LearningModeScreen from './src/screens/features/LearningModeScreen';
import QuizModeScreen from './src/screens/features/QuizModeScreen';
import ProgressScreen from './src/screens/features/ProgressScreen';
import SearchScreen from './src/screens/features/SearchScreen';
import SettingsScreen from './src/screens/features/SettingsScreen';
import InnovativeFeature1Screen from './src/screens/features/InnovativeFeature1Screen';
import InnovativeFeature2Screen from './src/screens/features/InnovativeFeature2Screen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5048E5',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Create" component={CreateListScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

// Main app component
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            {/* Auth Screens */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            
            {/* Main App */}
            <Stack.Screen name="Main" component={TabNavigator} />
            
            {/* Feature Screens */}
            <Stack.Screen name="AddWords" component={AddWordsScreen} options={{ headerShown: true, title: 'Add Words' }} />
            <Stack.Screen name="ListDetails" component={ListDetailsScreen} options={{ headerShown: true, title: 'List Details' }} />
            <Stack.Screen name="LearningMode" component={LearningModeScreen} options={{ headerShown: true, title: 'Learning Mode' }} />
            <Stack.Screen name="QuizMode" component={QuizModeScreen} options={{ headerShown: true, title: 'Quiz Mode' }} />
            <Stack.Screen name="InnovativeFeature1" component={InnovativeFeature1Screen} options={{ headerShown: true, title: 'Voice Recognition' }} />
            <Stack.Screen name="InnovativeFeature2" component={InnovativeFeature2Screen} options={{ headerShown: true, title: 'AR Word Learning' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
