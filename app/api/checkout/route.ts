import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // بررسی متد درخواست
  if (req.method === 'POST') {
    const { name, phone, address, deliveryDate } = req.body;

    // بررسی وجود داده‌ها
    if (!name || !phone || !address || !deliveryDate) {
      return res
        .status(400)
        .json({ status: 'failure', message: 'تمام فیلدها الزامی است' });
    }

    // شبیه‌سازی پردازش پرداخت
    const isSuccess = Math.random() > 0.5; // شبیه‌سازی نتیجه پرداخت
    if (isSuccess) {
      // شبیه‌سازی ذخیره سفارش در دیتابیس
      console.log('Order saved:', { name, phone, address, deliveryDate });

      // ارسال پاسخ موفقیت
      return res.status(200).json({ status: 'success' });
    } else {
      // شبیه‌سازی خطا در پرداخت
      return res
        .status(400)
        .json({ status: 'failure', message: 'پردازش پرداخت با مشکل مواجه شد' });
    }
  } else {
    // اگر متد درخواست POST نبود
    return res.status(405).json({ message: 'متد درخواست مجاز نیست' });
  }
}
