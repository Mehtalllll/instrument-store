import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { IProductCard } from '@/components/Home/ProductCard';

export interface ICardData {
  userId: string;
  product: IProductCard;
  quantity: number;
}

// مسیر فایل JSON که داده‌ها در آن ذخیره می‌شوند
const dataFilePath = path.join(process.cwd(), 'data', 'cartData.json');

// تابع برای خواندن داده‌ها از فایل
async function readCartData() {
  try {
    const data = await fs.promises.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading cart data:', err);
    return []; // در صورت خطا آرایه خالی بر می‌گردانیم
  }
}

// تابع برای نوشتن داده‌ها به فایل
async function writeCartData(data: ICardData) {
  try {
    await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing cart data:', err);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url); // گرفتن query params از URL
  const userId = searchParams.get('userId'); // دریافت userId از query

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const cartData = await readCartData(); // خواندن داده‌ها از فایل

  // فیلتر کردن داده‌ها بر اساس userId
  const filteredCartData = cartData.filter(
    (order: any) => order.userId === userId,
  );

  return NextResponse.json(filteredCartData, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log('Received:', body);

  const cartData = await readCartData(); // خواندن داده‌ها از فایل

  // بررسی می‌کنیم که آیا محصول قبلاً در سبد خرید وجود دارد یا خیر
  const existingProductIndex = cartData.findIndex(
    (order: ICardData) =>
      order.product._id === body.product._id && order.userId === body.userId,
  );

  if (existingProductIndex !== -1) {
    // اگر محصول وجود داشت، quantity آن را افزایش می‌دهیم
    cartData[existingProductIndex].quantity += 1;
  } else {
    // اگر محصول وجود نداشت، آن را به سبد خرید اضافه می‌کنیم و quantity را برابر 1 می‌گذاریم
    cartData.push({ ...body, quantity: 1 });
  }

  await writeCartData(cartData); // ذخیره داده‌ها در فایل

  return NextResponse.json(cartData, { status: 200 });
}

export async function DELETE(request: Request) {
  const body = await request.json(); // دریافت داده‌های ارسالی در درخواست

  const cartData = await readCartData(); // خواندن داده‌ها از فایل

  const existingProductIndex = cartData.findIndex(
    (order: ICardData) =>
      order.product._id === body.productId && order.userId === body.userId,
  );

  if (existingProductIndex !== -1) {
    if (cartData[existingProductIndex].quantity > 1) {
      cartData[existingProductIndex].quantity -= 1;
    } else {
      cartData.splice(existingProductIndex, 1);
    }
  } else {
    // اگر محصول وجود نداشت، آن را به سبد خرید اضافه می‌کنیم و quantity را برابر 1 می‌گذاریم
    return NextResponse.json({ error: 'order non found' }, { status: 404 });
  }

  await writeCartData(cartData); // ذخیره داده‌ها در فایل

  return NextResponse.json(cartData, { status: 200 });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json(); // دریافت داده‌های ارسالی در درخواست

    // بررسی داده‌های ورودی
    if (!body || !body.userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 },
      );
    }

    // خواندن داده‌های موجود
    const cartData: ICardData[] = await readCartData();

    // حذف کاربر موردنظر
    const newcartData = cartData.filter(d => d.userId !== body.userId);

    // ذخیره داده‌های جدید
    await writeCartData(newcartData as any);

    // بازگرداندن پاسخ با داده‌های جدید
    return NextResponse.json(newcartData, { status: 200 });
  } catch (error) {
    console.error('Error in PUT API:', error);

    // بازگرداندن پاسخ در صورت بروز خطا
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 },
    );
  }
}
