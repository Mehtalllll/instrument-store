import { IProductsList } from '@/types/Product';
interface IfetchAllproduct {
  page: number;
  category?: string;
  subcategory?: string;
}
type fetchAllproducttype = (args: IfetchAllproduct) => Promise<IProductsList>;
export const fetchAllproduct: fetchAllproducttype = async ({
  page,
  category,
  subcategory,
}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: '8',
      ...(category && { category }),
      ...(subcategory && { subcategory }),
    });
    console.log(queryParams.toString());

    const response = await fetch(
      `http://localhost:8000/api/products?${queryParams.toString()}`,
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
