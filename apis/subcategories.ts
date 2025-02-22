import { IRessubcategories } from '@/types/subcategories';

export const fetchSubCategories = async (): Promise<IRessubcategories> => {
  try {
    const response = await fetch('http://localhost:8000/api/subcategories', {
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
