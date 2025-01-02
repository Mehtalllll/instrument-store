'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { clearalllist, fetchCart } from '@/apis/PostCart';
import { getSession } from '@/apis/Session-management';
import { GetAddorder } from '@/apis/createorder';

const FakePaymentPage: React.FC = () => {
  const [userid, setuserid] = React.useState<string | null>(
    getSession('UserId'),
  );
  const [reload, setReload] = React.useState<boolean>(false);
  const router = useRouter();

  // استفاده از useQuery برای بارگذاری داده‌ها
  const { data, isLoading, isError } = useQuery(
    ['orderforApi', userid],
    () => fetchCart(userid as string),
    {
      keepPreviousData: true,
      staleTime: 5000,
    },
  );

  // تابعی برای پردازش پرداخت
  const handlePayment = (isSuccess: boolean) => {
    if (isSuccess) {
      if (data) {
        // ارسال داده‌ها به API برای ایجاد سفارش
        data.forEach(product => {
          GetAddorder(userid as string, product.product._id, product.quantity);
        });
      }
      clearalllist(userid as string);
      router.push('/payment-success');
    } else {
      router.push('/payment-failure'); // هدایت به صفحه شکست پرداخت
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading cart data.</div>;
  }

  return (
    <div className="p-6 container mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">درگاه پرداخت</h1>
      <p>پرداخت خود را شبیه‌سازی کنید:</p>
      <button
        onClick={() => handlePayment(true)}
        className="bg-green-500 text-white px-4 py-2 m-2"
      >
        پرداخت موفق
      </button>
      <button
        onClick={() => handlePayment(false)}
        className="bg-red-500 text-white px-4 py-2 m-2"
      >
        پرداخت ناموفق
      </button>
    </div>
  );
};

export default FakePaymentPage;
