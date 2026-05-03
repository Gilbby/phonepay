import { Platform } from 'react-native';

// When running on Android emulator, localhost = 10.0.2.2
// When running on iOS simulator or Expo Go, localhost = your machine IP
const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.26.239.59:3000/api'
    : 'http://10.26.239.59:3000/api';/* : 'http://localhost:3000/api'; */

export const API_URL = BASE_URL;

// Helper to get auth headers
export const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export default API_URL;