'use client';
import React from 'react';
import { GiCrossMark } from 'react-icons/gi';
const PaymentFailurePage: React.FC = () => {
  return (
    <div className="p-6 container mx-auto text-center">
      <GiCrossMark className="w-full text-center text-red-500" size={50} />
      <h1 className="text-xl font-bold mb-4">پرداخت ناموفق</h1>
      <p>پرداخت شما با خطا مواجه شد. لطفاً دوباره تلاش کنید.</p>
    </div>
  );
};

export default PaymentFailurePage;
