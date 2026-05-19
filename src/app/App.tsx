import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { AppProvider } from './providers/AppProvider';
import { RootNavigator } from '../navigation/RootNavigator';
import { useTheme } from '../hooks/useTheme';

function AppContent() {
  const { colors, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </View>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
