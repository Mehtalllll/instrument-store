import { IProductById } from '@/types/Product';

export const fetchProductById = async (Id: string): Promise<IProductById> => {
  try {
    const response = await fetch(`http://localhost:8000/api/products/${Id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
