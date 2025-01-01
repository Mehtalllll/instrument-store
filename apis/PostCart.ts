import { ICardData } from '@/app/api/cart/route';
import { IProductCard } from '@/components/Home/ProductCard';
import { log } from 'console';

const API_URL = 'http://localhost:3000/api/cart'; // مسیر API خود را مشخص کنید

export const fetchCart = async (userId: string): Promise<ICardData[]> => {
  try {
    const response = await fetch(`${API_URL}?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// ** POST: اضافه کردن محصول به سبد خرید **
export const addItemToCart = async (
  userId: string,
  product: IProductCard,
): Promise<void> => {
  try {
    // ارسال درخواست به API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, product }),
    });

    // چک کردن وضعیت پاسخ
    if (!response.ok) {
      const errorData = await response.json(); // اگر پاسخ خطا باشد، اطلاعات خطا را بخوانید
      throw new Error(
        `Error: ${response.status} - ${errorData.message || response.statusText}`,
      );
    }

    // نمایش پاسخ موفقیت آمیز
    const responseData = await response.json();
    console.log('Product added to cart:', responseData);
  } catch (error) {
    // چاپ خطا در کنسول
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// ** PUT: به‌روزرسانی تعداد محصول در سبد خرید **

// ** DELETE: حذف محصول از سبد خرید **
// اصلاح تابع ارسال درخواست DELETE در سمت کلاینت
export async function deleteProductFromCart(userId: string, productId: string) {
  try {
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, userId }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Product successfully deleted or quantity updated:', data);
      return data;
    } else {
      const errorData = await response.json();
      console.error('Error deleting product:', errorData.error);
      return null;
    }
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}
