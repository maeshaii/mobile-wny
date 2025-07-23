import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { logoutUser } from '../services/api';
import { useRouter } from 'expo-router';

export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      await logoutUser();
      router.replace('/login/login');
    };
    doLogout();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1e3a8a" />
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#1e3a8a',
  },
}); 