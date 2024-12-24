import { logout } from '@/app/Login-Singup/page';
import { getSession, setSession } from './Session-management';

export const getUserData = async () => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/users/${getSession('UserId')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const result: IUser = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      throw new Error(`Error: ${response.statusText}`);
    }
    if (response.ok) {
      console.log('Login successful:', result);
      return result;
    } else {
      console.error('Login failed:', result);
      alert(result || 'مشکلی پیش آمده است');
    }
  } catch (error) {
    console.log('Error:', error);
  }
};
