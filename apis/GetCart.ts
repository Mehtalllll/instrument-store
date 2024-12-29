// تابعی برای دریافت سفارش‌های کاربر
export default async function fetchUserOrders(userId: string) {
  try {
    const response = await fetch('/api/orders', {
      method: 'GET',
      headers: {
        'user-id': userId, // شناسه کاربر را به هدر اضافه می‌کنیم
      },
    });

    // بررسی وضعیت پاسخ
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    // دریافت داده‌ها از پاسخ
    const data = await response.json();
    // بررسی اینکه آیا سفارش‌ها دریافت شده‌اند
    if (data.status === 'success') {
      console.log('User Orders:', data.data.orders);
      return data.data.orders;
    } else {
      console.error('Error:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Request Error:', error);
    return [];
  }
}
