import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { AppProvider } from './providers/AppProvider';
import { RootNavigator } from '../navigation/RootNavigator';
import { useTheme } from '../hooks/useTheme';
import { useUIStore, useAppState } from './store';
import { storage } from '../utils/storage';
import { db } from '../database/db';

function AppContent() {
  const { colors, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </View>
  );
}

function SplashScreen() {
  return (
    <View style={styles.splash}>
      <ActivityIndicator size="large" color="#4A90D9" />
    </View>
  );
}

export function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        // 1. Load all persisted key-value settings from disk
        await storage.initialize();

        // 2. Hydrate UI store (theme + language) from persisted storage
        const savedTheme = storage.getItem('theme') as 'dark' | 'light' | null;
        const savedLanguage = storage.getItem('language') as 'ar' | 'en' | null;
        useUIStore.setState({
          theme: savedTheme ?? 'dark',
          language: savedLanguage ?? 'ar',
        });

        // 3. Hydrate cart from persisted storage
        const savedCart = storage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              useAppState.setState({ cart: parsedCart });
            }
          } catch {
            // ignore corrupt cart
          }
        }

        // 4. Pre-initialize local database
        await db.initialize();
      } catch (e) {
        console.error('App bootstrap error:', e);
      } finally {
        setIsReady(true);
      }
    }
    bootstrap();
  }, []);

  return (
    <AppProvider>
      {isReady ? <AppContent /> : <SplashScreen />}
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splash: {
    flex: 1,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

