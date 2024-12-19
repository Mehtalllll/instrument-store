export const GetEditeorder = async (deliveryStatus: boolean, id: any) => {
  try {
    const response = await fetch(`http://localhost:8000/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryStatus: deliveryStatus }),
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
