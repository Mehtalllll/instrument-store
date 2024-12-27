import { logout } from '@/app/Login-Singup/page';
import { getSession } from './Session-management';

export const fetchDelproduct = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:8000/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getSession('accessToken')}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
