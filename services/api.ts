import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Use API_BASE_URL from environment variables if available
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || process.env.API_BASE_URL || 'http://192.168.254.135:8000';

export const loginUser = async (acc_username: string, acc_password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/token/`, {
    acc_username,
    acc_password,
  });
    const data = response.data;
    if (data.access && data.refresh) {
      await SecureStore.setItemAsync('accessToken', data.access);
      await SecureStore.setItemAsync('refreshToken', data.refresh);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getAccessToken = async () => {
  return await SecureStore.getItemAsync('accessToken');
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync('refreshToken');
};

export const getUserInfo = async () => {
  const user = await SecureStore.getItemAsync('user');
  return user ? JSON.parse(user) : null;
};

export const logoutUser = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
  await SecureStore.deleteItemAsync('user');
}; 