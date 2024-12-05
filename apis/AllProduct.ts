import { IProductsList } from '@/types/Product';

export const fetchAllproduct = async (page: number): Promise<IProductsList> => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/products?page=${page}&limit=8&fields=-rating,-createdAt,-updatedAt,-__v&sort=price&quantity[gte]=8`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
