'use client';
import React from 'react';
import { TiTick } from 'react-icons/ti';
const PaymentSuccessPage: React.FC = () => {
  return (
    <div className="p-6 container text-center">
      <TiTick className="w-full text-center text-green-500" size={50} />
      <h1 className="text-xl font-bold mb-4">پرداخت موفق</h1>
      <p>سفارش شما با موفقیت ثبت شد. از خرید شما متشکریم!</p>
    </div>
  );
};

export default PaymentSuccessPage;
