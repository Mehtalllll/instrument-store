'use client';
import { TiDeleteOutline } from 'react-icons/ti';
import { FaCaretDown } from 'react-icons/fa';
import { RootState } from '@/Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { FaCaretUp } from 'react-icons/fa6';
import { AddToCartActions } from '@/Redux/Features/AddToCart';
import Button from '@/components/Global/Button';
import { ClassNames } from '@/utils/classname-join';
import toPersianNumbers from '@/utils/EnToFA';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import React from 'react';
import { getSession } from '@/apis/Session-management';
import {
  addItemToCart,
  clearalllist,
  deleteProductFromCart,
  fetchCart,
} from '@/apis/PostCart';
import { useRouter } from 'next/navigation';

const OrdersForUser: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.AddToCart.cart);
  const [userid, setuserid] = React.useState<string | null>(
    getSession('UserId'),
  );
  const [reload, setreload] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  const totalAmount = orders.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );

  const orderforApi = useQuery(
    ['orderforApi', userid, reload],
    () => fetchCart(userid as string),
    {
      keepPreviousData: true,
      staleTime: 5000,
      onSuccess: () => setreload(false),
    },
  );

  const totalAmountAPI = orderforApi.data
    ?.filter(a => a.userId === userid)
    .reduce(
      (total, product) => total + product.product.price * product.quantity,
      0,
    );

  const removeProductMutation = useMutation(
    (id: string) => deleteProductFromCart(userid as string, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orderforApi');
      },
    },
  );

  const increaseQuantityMutation = useMutation(
    (product: any) => addItemToCart(userid as string, product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orderforApi');
      },
    },
  );

  const handleRemoveProduct = (id: string) => {
    removeProductMutation.mutate(id);
  };

  const handleIncreaseQuantity = (product: any) => {
    increaseQuantityMutation.mutate(product);
  };

  const handleClearAllorder = () => {
    if (!userid) {
      dispatch(AddToCartActions.clearCart());
    } else {
      clearalllist(userid as string).then(() => {
        queryClient.invalidateQueries('orderforApi'); // کوئری را دوباره اجرا می‌کند
      });
    }
  };

  return (
    <main className="p-4">
      <div className="bg-white w-full h-fit rounded-md shadow-lg p-3 ">
        <div className="flex justify-between pb-2">
          <Button
            text="خالی کردن سبد خرید"
            onClick={handleClearAllorder}
            classname={ClassNames(
              'border-green-300 text-xs text-white w-[110px] flex',
              ' justify-center h-7 font-semibold bg-teal-500 hover:bg-teal-400',
              'sm:w-28 sm:h-8 lg:w-36 sm:text-sm text-nowrap',
            )}
          />
          <p className="text-sm font-bold text-slate-700 sm:text-base">
            سبد خرید
          </p>
        </div>
        <div className=" w-full h-fit grid grid-cols-1 gap-y-5 gap-3 overflow-x-auto">
          <table className="w-full max-w-[1500px] mx-auto border-collapse border border-gray-300 text-center">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="p-2 text-xs sm:text-sm font-medium">
                  حذف محصول
                </th>
                <th className="p-2 text-xs sm:text-sm font-medium">
                  قیمت در تعداد
                </th>
                <th className="p-2 text-xs sm:text-sm font-medium">قیمت</th>
                <th className="p-2 text-xs sm:text-sm font-medium">تعداد</th>
                <th className="p-2 text-xs sm:text-sm font-medium">
                  نام محصول
                </th>
                <th className="p-2 text-xs sm:text-sm font-medium">تصویر</th>
              </tr>
            </thead>
            <tbody>
              {userid !== null &&
              orderforApi.isSuccess &&
              orderforApi.data.length > 0 ? (
                orderforApi.data.map((o, index) =>
                  o.product ? (
                    <tr
                      key={o.product._id}
                      className={`${index % 2 === 0 ? 'bg-teal-50' : 'bg-white'} hover:bg-gray-50`}
                    >
                      <td className="p-2">
                        <TiDeleteOutline
                          className="mx-auto w-10 cursor-pointer hover:text-red-500"
                          size={25}
                          onClick={() => (
                            deleteProductFromCart(userid, o.product._id),
                            setreload(!reload),
                            console.log(o.product._id)
                          )}
                        />
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        {toPersianNumbers(o.product.price * o.quantity)}
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        {toPersianNumbers(o.product.price)}
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleIncreaseQuantity(o.product)}
                            className="w-5 bg-teal-300 hover:bg-teal-200 flex justify-center items-center h-7 cursor-pointer rounded-l-md"
                          >
                            <FaCaretUp />
                          </button>
                          <input
                            className="w-7 text-center h-7 "
                            type="text"
                            value={o.quantity}
                          />
                          <button
                            onClick={() => handleRemoveProduct(o.product._id)}
                            className="w-5 bg-teal-300 hover:bg-teal-200 h-7 cursor-pointer flex justify-center items-center rounded-r-md"
                          >
                            <FaCaretDown />
                          </button>
                        </div>
                      </td>
                      <td className="text-xs sm:text-sm p-2">
                        {o.product.name}
                      </td>
                      <td className="flex justify-center p-2">
                        <img
                          src={`http://localhost:8000/images/products/images/${o.product.images[0]}`}
                          alt={o.product.name}
                          className="w-full max-w-20"
                        />
                      </td>
                    </tr>
                  ) : null,
                )
              ) : orders.length > 0 && !userid ? (
                // اگر داده‌ها از API وجود ندارد، داده‌ها از local state (orders) نمایش داده می‌شود
                orders
                  .filter(e => e.quantity > 0)
                  .map((o, index) => (
                    <tr
                      key={o._id}
                      className={`${index % 2 === 0 ? 'bg-teal-50' : 'bg-white'} hover:bg-gray-50`}
                    >
                      <td className="p-2">
                        <TiDeleteOutline
                          className="mx-auto w-10 cursor-pointer hover:text-red-500"
                          size={25}
                          onClick={() =>
                            dispatch(
                              AddToCartActions.removeProductFromCart(o._id),
                            )
                          }
                        />
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        {toPersianNumbers(o.price * o.quantity)}
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        {toPersianNumbers(o.price)}
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        <div className="flex justify-center">
                          <button
                            onClick={() =>
                              dispatch(
                                AddToCartActions.PlusProductQuantity({
                                  productId: o._id,
                                }),
                              )
                            }
                            className="w-5 bg-teal-300 hover:bg-teal-200 flex justify-center items-center h-7 cursor-pointer rounded-l-md"
                          >
                            <FaCaretUp />
                          </button>
                          <input
                            className="w-7 text-center h-7 "
                            type="text"
                            value={o.quantity}
                            onChange={e =>
                              dispatch(
                                AddToCartActions.updateProductQuantity({
                                  productId: o._id,
                                  quantity: Number(e.target.value),
                                }),
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              dispatch(
                                AddToCartActions.MinusProductQuantity({
                                  productId: o._id,
                                }),
                              )
                            }
                            className="w-5 bg-teal-300 hover:bg-teal-200 h-7 cursor-pointer flex justify-center items-center rounded-r-md"
                          >
                            <FaCaretDown />
                          </button>
                        </div>
                      </td>
                      <td className="text-xs sm:text-sm p-2">{o.name}</td>
                      <td className="flex justify-center p-2">
                        <img
                          src={`http://localhost:8000/images/products/images/${o.images[0]}`}
                          alt={o.name}
                          className="w-full max-w-20"
                        />
                      </td>
                    </tr>
                  ))
              ) : (
                // اگر هیچ داده‌ای از API یا local state وجود نداشت
                <tr>
                  <td
                    colSpan={6}
                    className="mx-auto p-10 text-slate-700 text-base font-semibold"
                  >
                    سفارشی موجود نیست
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-around py-4">
          <Button
            text="نهایی کردن خرید"
            onClick={() =>
              userid ? router.push('/checkout') : router.push('/Login-Singup')
            }
            classname={ClassNames(
              'border-green-300 text-xs text-white w-[110px] flex',
              ' justify-center h-7 font-semibold bg-green-500 hover:bg-green-400',
              'sm:w-28 sm:h-8 lg:w-36 sm:text-sm text-nowrap',
            )}
          />
          <p className="text-sm font-bold text-slate-700 sm:text-base">
            مبلغ قابل پرداخت:{' '}
            {userid && orderforApi.isSuccess
              ? toPersianNumbers(totalAmountAPI as number)
              : toPersianNumbers(totalAmount)}
          </p>
        </div>
      </div>
    </main>
  );
};

export default OrdersForUser;
