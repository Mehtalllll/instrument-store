import { getSession } from './Session-management';

export const GetAddProduct = async (formData: FormData) => {
  try {
    const response = await fetch(`http://localhost:8000/api/products`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getSession('accessToken')}`,
      },
    });

    if (!response.ok) {
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
