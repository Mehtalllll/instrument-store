import { IResOrders } from '@/types/Orders';

export const fetchAllOrders = async (
  page: number,
  deliveryStatus?: boolean | null, // مقدار وضعیت ارسال
): Promise<IResOrders> => {
  try {
    // ساخت query params بر اساس deliveryStatus
    const queryParams = new URLSearchParams();
    queryParams.append('limit', '8');
    queryParams.append('page', String(page));
    if (deliveryStatus !== null && deliveryStatus !== undefined) {
      queryParams.append('deliveryStatus', String(deliveryStatus));
    }

    const response = await fetch(
      `http://localhost:8000/api/orders?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};
