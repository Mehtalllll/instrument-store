export const GetEditeProduct = async (formData: FormData, id: any) => {
  const response = await fetch(`http://localhost:8000/api/products/${id}`, {
    method: 'PATCH',
    body: formData,
  });
  const result = await response.json();
  console.log('Server Response:', result);
};
