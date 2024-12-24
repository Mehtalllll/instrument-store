import { logout } from '@/app/Login-Singup/page';
import { getSession } from './Session-management';

export const getAllUserData = async () => {
  console.log(getSession('accessToken'));
  try {
    const response = await fetch(`http://localhost:8000/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getSession('accessToken')}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 200) {
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
