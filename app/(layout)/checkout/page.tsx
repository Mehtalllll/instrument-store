'use client';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // استایل‌دهی تاریخ‌پیکر
import { AddToCartActions } from '@/Redux/Features/AddToCart';
import { useRouter } from 'next/navigation';
import moment from 'moment-jalaali'; // برای تبدیل تاریخ میلادی به شمسی

interface FormData {
  name: string;
  phone: string;
  address: string;
  deliveryDate: string;
}

const CheckoutPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    router.push('/Payment');
  };

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-lg max-w-md mx-auto text-right">
      <h1 className="text-xl font-bold mb-6 text-center text-gray-700">
        نهایی کردن خرید
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            :نام
          </label>
          <input
            {...register('name', { required: 'وارد کردن نام الزامی است.' })}
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            :شماره تماس
          </label>
          <input
            {...register('phone', {
              required: 'شماره تماس الزامی است.',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'شماره تماس معتبر نیست.',
              },
            })}
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            :آدرس
          </label>
          <textarea
            {...register('address', { required: 'آدرس الزامی است.' })}
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            :تاریخ تحویل
          </label>
          <Controller
            name="deliveryDate"
            control={control}
            rules={{ required: 'تاریخ تحویل الزامی است.' }}
            render={({ field }) => (
              <DatePicker
                selected={
                  field.value
                    ? moment(field.value, 'jYYYY/jMM/jDD').toDate()
                    : null
                }
                onChange={(date: Date | null) =>
                  field.onChange(
                    date ? moment(date).format('jYYYY/jMM/jDD') : null,
                  )
                }
                dateFormat="yyyy/MM/dd" // اینجا از فرمت میلادی استفاده می‌کنیم
                className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                locale="fa" // تنظیم زبان فارسی
              />
            )}
          />
          {errors.deliveryDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.deliveryDate.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          پرداخت
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
