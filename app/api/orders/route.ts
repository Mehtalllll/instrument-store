import { NextRequest, NextResponse } from 'next/server';

type OrderProduct = {
  product: string; // شناسه محصول
  count: number; // تعداد محصول
  _id: string; // شناسه محصول در لیست سفارش
};

type IOrders = {
  _id: string; // شناسه سفارش
  user: string; // شناسه کاربر
  products: OrderProduct[]; // لیست محصولات
  totalPrice: number; // مجموع قیمت
  deliveryDate: string; // تاریخ تحویل
  deliveryStatus: boolean; // وضعیت تحویل
  createdAt: string; // تاریخ ایجاد
  updatedAt: string; // تاریخ به‌روزرسانی
};

type IResOrders = {
  status: string; // وضعیت پاسخ
  data: {
    orders: IOrders[]; // آرایه‌ای از سفارش‌ها
  };
};

// حافظه موقت برای ذخیره سفارش‌ها
let orders: IOrders[] = [];
let nextId = 1; // شناسه خودکار برای سفارش‌ها

// 1. GET: دریافت تمام سفارش‌های کاربر (بدون صفحه‌بندی)
export async function GET(req: NextRequest) {
  const userId = req.headers.get('user-id');

  if (!userId) {
    return NextResponse.json(
      { status: 'error', message: 'User ID is required' },
      { status: 400 },
    );
  }

  // فیلتر کردن سفارش‌های کاربر
  const userOrders = orders.filter(order => order.user === userId);

  // پاسخ بدون صفحه‌بندی
  const response: IResOrders = {
    status: 'success',
    data: { orders: userOrders },
  };

  return NextResponse.json(response);
}

// 2. POST: ایجاد سفارش جدید
export async function POST(req: NextRequest) {
  const userId = req.headers.get('user-id');
  const body = await req.json();

  if (!userId) {
    return NextResponse.json(
      { status: 'error', message: 'User ID is required' },
      { status: 400 },
    );
  }

  const { products, totalPrice, deliveryDate } = body;

  if (!products || !Array.isArray(products) || !totalPrice || !deliveryDate) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid data' },
      { status: 400 },
    );
  }

  const newOrder: IOrders = {
    _id: (nextId++).toString(),
    user: userId,
    products,
    totalPrice,
    deliveryDate,
    deliveryStatus: false, // سفارش جدید تحویل نشده است
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  return NextResponse.json({ status: 'success', data: newOrder });
}

// 3. PATCH: به‌روزرسانی وضعیت تحویل سفارش
export async function PATCH(req: NextRequest) {
  const userId = req.headers.get('user-id');
  const body = await req.json();
  const { orderId, deliveryStatus } = body;

  if (!userId || !orderId || deliveryStatus == null) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid data' },
      { status: 400 },
    );
  }

  const order = orders.find(o => o._id === orderId && o.user === userId);

  if (!order) {
    return NextResponse.json(
      { status: 'error', message: 'Order not found' },
      { status: 404 },
    );
  }

  order.deliveryStatus = deliveryStatus;
  order.updatedAt = new Date().toISOString();

  return NextResponse.json({ status: 'success', data: order });
}

// 4. DELETE: حذف سفارش
export async function DELETE(req: NextRequest) {
  const userId = req.headers.get('user-id');
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!userId || !orderId) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid data' },
      { status: 400 },
    );
  }

  const initialLength = orders.length;
  orders = orders.filter(
    order => !(order._id === orderId && order.user === userId),
  );

  if (orders.length === initialLength) {
    return NextResponse.json(
      { status: 'error', message: 'Order not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({
    status: 'success',
    message: 'Order deleted successfully',
  });
}
