'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/apis/Session-management'; // یا هر متدی که برای بررسی اطلاعات session استفاده می‌کنید.

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // وضعیت برای اطمینان از بارگذاری کامل

  useEffect(() => {
    // فرض بر این است که یک تابع برای گرفتن نقش کاربر از سشن دارید
    const userRole = getSession('UserRole'); // بررسی نقش کاربر از session

    if (userRole !== 'ADMIN') {
      router.push('/'); // اگر کاربر ادمین نباشد، به صفحه‌ی اصلی هدایت می‌شود
    } else {
      setIsAdmin(true); // اگر ادمین باشد، مقدار true تنظیم می‌شود
    }
  }, [router]);

  // وقتی که وضعیت بارگذاری کامل شد، محتویات صفحه نمایش داده می‌شود
  if (isAdmin === null) {
    return <div>Loading...</div>; // یا می‌توانید صفحه‌ی لودینگ دیگر را نمایش دهید
  }

  return <>{children}</>;
};

export default AdminGuard;
