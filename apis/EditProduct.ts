export const GetEditeProduct = async (formData: FormData, id: any) => {
  try {
    const response = await fetch(`http://localhost:8000/api/products/${id}`, {
      method: 'PATCH',
      body: formData,
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
