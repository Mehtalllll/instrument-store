'use client';

import { FaCaretDown, FaCaretUp, FaCartShopping } from 'react-icons/fa6';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';
import React from 'react';
import { MdAdminPanelSettings } from 'react-icons/md';
import { IoLogOut } from 'react-icons/io5';
import Button from '@/components/Global/Button';
import { delSession, getSession } from '@/apis/Session-management';
import Hamburger from '@/components/Global/Hamburger';
import { getUserData } from '@/apis/UserData';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { TiDeleteOutline } from 'react-icons/ti';
import { AddToCartActions } from '@/Redux/Features/AddToCart';
import { ClassNames } from '@/utils/classname-join';
import toPersianNumbers from '@/utils/EnToFA';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  addItemToCart,
  deleteProductFromCart,
  fetchCart,
} from '@/apis/PostCart';

const Navbar: React.FC = () => {
  const [isOpenCart, setisOpenCart] = React.useState<boolean>(false);
  const [information, setInformation] = React.useState<{
    name: string;
    role: string;
  } | null>(null);
  const [userid, setuserid] = React.useState<string | null>(
    getSession('UserId'),
  );
  const [reload, setreload] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.AddToCart.cart);

  const totalAmount = orders.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );

  const orderforApi = useQuery(
    ['orderforApi', userid, reload, isOpenCart],
    () => fetchCart(userid as string),
    {
      keepPreviousData: true,
      staleTime: 5000,
      onSuccess: () => setreload(false),
    },
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

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        data &&
          setInformation({
            name: data?.data.user.firstname,
            role: data?.data.user.role,
          });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const totalQuantity = useSelector((state: RootState) =>
    state.AddToCart.cart.reduce(
      (acc: number, item: any) => acc + item.quantity,
      0,
    ),
  );

  return (
    <main className="container mx-auto flex flex-col justify-center p-4">
      <section className="flex flex-row justify-between items-center w-full">
        <Link href={'/'}>
          <div className=" sm:gap-x-4 flex flex-row justify-center items-center ">
            <img
              src="./music-shop.png"
              alt="Meh store icon"
              className=" w-full max-w-10 sm:max-w-14"
            />
            <p className="text-2xl ml-2 sm:text-3xl  font-bold font-mono text-slate-600 pt-2">
              Meh Store
            </p>
          </div>
        </Link>
        <input
          type="text"
          placeholder="جستجو"
          className="placeholder:text-right hidden sm:block w-full max-w-[500px] mx-4 sm:mx-10 rounded-md border-2 px-2 pb-1 h-10 border-slate-300"
        />
        <div className="flex flex-row items-center justify-center gap-x-2">
          {getSession('UserId') && (
            <div className="flex flex-row gap-x-2">
              <Link href={'/'}>
                <div
                  className="w-10 h-10 hidden sm:flex items-center justify-center text-white bg-blue-400 rounded-md cursor-pointer hover:bg-blue-500"
                  title="LogOut"
                  onClick={() => {
                    delSession('UserId'), toast.success('خروج موفقیت آمیز');
                  }}
                >
                  <IoLogOut size={22} />
                </div>
                <div
                  className="sm:hidden text-blue-500"
                  onClick={() => {
                    delSession('UserId'), toast.success('خروج موفقیت آمیز');
                  }}
                >
                  <IoLogOut size={25} title="LogOut" />
                </div>
              </Link>
              <div className="max-w-36 overflow-hidden">
                <Link
                  href={`${getSession('UserRole') === 'ADMIN' ? 'Admin-panel' : 'User-panel'}`}
                >
                  <div className="text-orange-500 sm:hidden ">
                    {information?.role === 'USER' ? (
                      <FaUser title="User panel" size={25} />
                    ) : (
                      <MdAdminPanelSettings title="Admin panel" size={25} />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <Button
                      classnamefoText="marquee-text text-sm text-nowrap"
                      text={information?.name as any}
                      img={
                        information?.role === 'USER' ? (
                          <FaUser title="User panel" />
                        ) : (
                          <MdAdminPanelSettings title="Admin panel" size={20} />
                        )
                      }
                      classname="text-sm font-semibold w-36  border-orange-500 text-orange-500"
                      color="bg-orange-500"
                    />
                  </div>
                </Link>
              </div>
              <Link href={'/orders'}>
                <div className="sm:hidden text-green-500 flex justify-center items-center cursor-pointer ">
                  <FaCartShopping size={21} title="سبد خرید" />
                </div>
              </Link>
            </div>
          )}
          {!getSession('UserId') && (
            <Link href={'/Login-Singup'}>
              <div className="text-orange-500 sm:hidden">
                <FaUser />
              </div>
              <div className="hidden sm:block">
                <Button
                  text="ورود کاربران"
                  img={<FaUser />}
                  classname="text-sm font-semibold w-36  border-orange-500 text-orange-500"
                  color="bg-orange-500"
                />
              </div>
            </Link>
          )}

          <div
            onMouseEnter={() => setisOpenCart(true)}
            onMouseLeave={() => setisOpenCart(false)}
            className="hidden sm:block"
          >
            <Link href={'/orders'}>
              <Button
                text="سبد خرید"
                img={<FaCartShopping />}
                number={
                  userid
                    ? orderforApi.data
                        ?.filter(e => e.userId === userid)
                        .reduce((acc, item) => acc + item.quantity, 0)
                    : totalQuantity
                }
                classname=" font-semibold w-36  border-green-500 text-green-500"
                color="bg-green-500"
              />
            </Link>
            {isOpenCart && (
              <div className=" w-full max-w-[500px] py-4  h-fit grid grid-cols-1  absolute top-16 right-4 z-50 gap-y-5 gap-3 overflow-x-auto">
                <div className=" p-4 w-full bg-teal-50 shadow-md max-h-[400px] rounded-md overflow-y-scroll noscrollbar">
                  <table className="w-full max-w-[1500px]  mx-auto border-collapse border border-gray-300 text-center">
                    <thead className="bg-gray-100 text-gray-800">
                      <tr>
                        <th className="p-2 text-xs sm:text-sm font-medium">
                          حذف محصول
                        </th>
                        <th className="p-2 text-xs sm:text-sm font-medium">
                          قیمت در تعداد
                        </th>
                        <th className="p-2 text-xs sm:text-sm font-medium">
                          قیمت
                        </th>
                        <th className="p-2 text-xs sm:text-sm font-medium">
                          تعداد
                        </th>
                        <th className="p-2 text-xs sm:text-sm font-medium">
                          نام محصول
                        </th>
                        <th className="p-2 text-xs sm:text-sm font-medium">
                          تصویر
                        </th>
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
                                    deleteProductFromCart(
                                      userid,
                                      o.product._id,
                                    ),
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
                                    onClick={() =>
                                      handleIncreaseQuantity(o.product)
                                    }
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
                                    onClick={() =>
                                      handleRemoveProduct(o.product._id)
                                    }
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
                                      AddToCartActions.removeProductFromCart(
                                        o._id,
                                      ),
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
                              <td className="text-xs sm:text-sm p-2">
                                {o.name}
                              </td>
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
                  <div className="flex justify-around py-4">
                    <Button
                      text="نهایی کردن خرید"
                      onClick={() => dispatch(AddToCartActions.clearCart())}
                      classname={ClassNames(
                        'border-green-300 text-xs text-white w-[110px] flex',
                        ' justify-center h-7 font-semibold bg-green-500 hover:bg-green-400',
                        'sm:w-28 sm:h-8 lg:w-36 sm:text-sm text-nowrap',
                      )}
                    />
                    <p className="text-sm font-bold text-slate-700 sm:text-base">
                      مبلغ قابل پرداخت: {toPersianNumbers(totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <hr className="border border-slate-300 mt-3" />
      <section className=" flex flex-row pt-3 justify-between  w-full h-14 sm:hidden">
        <div className="flex items-center w-full">
          <input
            type="text"
            placeholder="جستجو"
            className="placeholder:text-right  block w-full mx-2 rounded-md border-2 px-2 pb-1 h-10 border-slate-300"
          />
        </div>

        <Link href={'./products'}>
          <Hamburger />
        </Link>
      </section>
      <section className=" sm:flex flex-row pt-3 hidden justify-between items-center w-full h-14">
        <div className="w-full max-w-32 flex  items-center flex-col ">
          <p className="text-teal-500 font-semibold"> 09033250600</p>
          <p className="bg-slate-300 rounded-md text-xs font-semibold py-1 px-2">
            از 10 صبح الی 19 عصر
          </p>
        </div>
        <div className="w-full max-w-[400px] flex justify-around ">
          <p className="hover:underline cursor-pointer hover:text-teal-600">
            درباره ما
          </p>
          <p className="hover:underline cursor-pointer hover:text-teal-600">
            تماس با ما
          </p>
          <p className="hover:underline cursor-pointer hover:text-teal-600">
            فروش اقساطی
          </p>
        </div>
        <div className="w-full max-w-fit h-10 ">
          <Hamburger />
        </div>
      </section>
    </main>
  );
};

export default Navbar;
