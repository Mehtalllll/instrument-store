export default async function createOrder(userId: string, newOrder: string) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'user-id': userId, // ارسال شناسه کاربر در هدر
    },
    body: newOrder, // ارسال داده‌ها به‌صورت JSON
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Order created successfully:', data);
  } else {
    console.log('Error creating order:', data);
  }
}
