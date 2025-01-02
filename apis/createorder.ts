import { logout } from '@/app/Login-Singup/page';
import { getSession } from './Session-management';

export const GetAddorder = async (
  userid: string,
  id: string,
  count: number,
) => {
  try {
    const accessToken = getSession('accessToken'); // اطمینان از اینکه توکن در دسترس است
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`http://localhost:8000/api/orders`, {
      method: 'POST',
      body: JSON.stringify({
        user: userid,
        products: [
          {
            product: id,
            count: count,
          },
        ],
      }),
      headers: {
        'Content-Type': 'application/json', // اضافه کردن Content-Type
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout(); // در صورت خطای 401، کاربر را از سیستم خارج می‌کنیم
      }
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Server Response:', result);
    return result;
  } catch (error) {
    console.error('Error during product update:', error);
    throw error;
  }
};
