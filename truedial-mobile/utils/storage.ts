import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Retrieves a value securely from device keychain on mobile,
 * or from localStorage when running in a web browser.
 */
export async function getStorageItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn('Failed to retrieve item from SecureStore', error);
    return null;
  }
}

/**
 * Saves a value securely to device keychain on mobile,
 * or to localStorage when running in a web browser.
 */
export async function setStorageItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.warn('Failed to save item to SecureStore', error);
  }
}

/**
 * Deletes a value securely from device keychain on mobile,
 * or from localStorage when running in a web browser.
 */
export async function removeStorageItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.warn('Failed to remove item from SecureStore', error);
  }
}
