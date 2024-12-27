import { logout } from '@/app/Login-Singup/page';

export const GetEditeProduct = async (formData: FormData, id: any) => {
  try {
    const response = await fetch(`http://localhost:8000/api/products/${id}`, {
      method: 'PATCH',
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
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
