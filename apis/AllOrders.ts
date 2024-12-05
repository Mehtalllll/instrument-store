import { IResOrders } from '@/types/Orders';
import { getSession } from './Session-management';

export const fetchAllOrders = async (page: number): Promise<IResOrders> => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/orders?page=${page}`,
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
