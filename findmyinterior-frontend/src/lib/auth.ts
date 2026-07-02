import api from './api';
import { useAuthStore } from './store/useAuthStore';

export const handleLogoutAction = async () => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.error('Logout error', err);
  }
  useAuthStore.getState().logout();
};
