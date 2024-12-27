import { IResOrders } from '@/types/Orders';
import React from 'react';
import Button from '../Global/Button';
import { IResUserlist } from '@/types/Alluser';
import { ClassNames } from '@/utils/classname-join';
import { fetchAllOrders } from '@/apis/AllOrders';
import { getAllUserData } from '@/apis/AllUserData';
import ModalForEdite from '../Global/Edite-modal';
import { GetEditeorder } from '@/apis/EditOrder';
import { useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { table } from 'console';
import { fetchProductById } from '@/apis/GetProductById';
import ProductName from './orderProduct';

const OrderForAdmin: React.FC = () => {
  const [Pageproduct, setPageproduct] = React.useState<number>(1);
  const [orderId, setorderId] = React.useState<string | null>(null);
  const [information, setInformation] = React.useState<IResUserlist>();
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'asc',
  );
  const [deliveryStatus, setdeliveryStatus] = React.useState<
    'all' | 'delivered' | 'Notdelivered'
  >('all');

  const AllOrders = useQuery(
    ['Orders', Pageproduct, orderId, deliveryStatus],
    () =>
      fetchAllOrders(
        Pageproduct,
        deliveryStatus === 'all'
          ? null
          : deliveryStatus === 'delivered'
            ? true
            : false,
      ),
    {
      keepPreviousData: true,
      staleTime: 5000,
      onError: error => {
        console.error('Error fetching orders:', error);
      },
    },
  );

  React.useEffect(() => {
    setPageproduct(1); // بازنشانی شماره صفحه به ۱
  }, [deliveryStatus]); // وقتی deliveryStatus تغییر کند

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  const queryClient = useQueryClient();
  const handeldeliveryStatus = async (deliveryStatus: boolean, id: string) => {
    try {
      await GetEditeorder(deliveryStatus, id); // ارسال وضعیت به سرور

      queryClient.invalidateQueries(['Orders']);
      setorderId(null);
      deliveryStatus
        ? toast.success('وضعیت به تحویل شده تغییر کرد')
        : toast.success('وضعیت به تحویل نشده تغییر کرد');
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const sortedData = React.useMemo(() => {
    if (!AllOrders || !sortColumn) return AllOrders;

    return AllOrders.data?.data.orders.sort((a, b) => {
      const valueA = a[sortColumn as keyof typeof a];
      const valueB = b[sortColumn as keyof typeof b];

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [deliveryStatus, sortColumn, sortDirection, AllOrders]);

  const moment = require('jalali-moment');

  function convertToJalali(isoDate: string) {
    const date = moment(isoDate);

    const jalaliDate = date.locale('fa').format('YYYY/MM/DD HH:mm:ss');

    return jalaliDate;
  }

  const totalpagesArrayForProduct = [];
  for (let i = 1; i <= Number(AllOrders.data?.total_pages); i++) {
    totalpagesArrayForProduct.push(i);
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const data: IResUserlist = await getAllUserData();
      setInformation(data);
    };

    fetchData();
  }, [Pageproduct]);

  const maxVisiblePages = 5; // تعداد صفحات قابل نمایش در یک زمان

  const visiblePages = React.useMemo(() => {
    const total = Number(AllOrders.data?.total_pages) || 1;
    const startPage = Math.max(
      1,
      Pageproduct - Math.floor(maxVisiblePages / 2),
    );
    const endPage = Math.min(total, startPage + maxVisiblePages - 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }, [Pageproduct, AllOrders.data?.total_pages]);
  return (
    <main className="pt-4">
      <section className="w-full max-w-[1000px] mx-auto bg-white rounded-md shadow-md  h-fit pt-2 px-4">
        <div className="flex justify-between py-2">
          <div className="flex flex-col sm:flex-row  gap-y-2 ">
            <div>
              <input
                type="checkbox"
                id="all"
                checked={deliveryStatus == 'all'}
                onChange={() => setdeliveryStatus('all')}
              />
              <label
                htmlFor="all"
                className={`ml-2 cursor-pointer text-xs sm:text-sm font-semibold px-4  ${
                  deliveryStatus === 'all'
                    ? 'text-teal-500 '
                    : 'text-slate-700 '
                }`}
              >
                همه کالاها
              </label>
            </div>

            <div>
              <input
                type="checkbox"
                id="delivered"
                checked={deliveryStatus == 'delivered'}
                onChange={() => setdeliveryStatus('delivered')}
              />
              <label
                htmlFor="delivered"
                className={`ml-2 cursor-pointer text-xs sm:text-sm font-semibold px-4 py-2 ${
                  deliveryStatus == 'delivered'
                    ? 'text-teal-500 '
                    : 'text-slate-700 '
                }`}
              >
                کالاهای ارسال شده
              </label>
            </div>

            <div>
              <input
                type="checkbox"
                id="notDelivered"
                checked={deliveryStatus == 'Notdelivered'}
                onChange={() => setdeliveryStatus('Notdelivered')}
              />
              <label
                htmlFor="notDelivered"
                className={`ml-2 cursor-pointer text-xs sm:text-sm font-semibold px-4 py-2 ${
                  deliveryStatus == 'Notdelivered'
                    ? 'text-teal-500 '
                    : 'text-slate-700 '
                }`}
              >
                کالاهای ارسال نشده
              </label>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-700 sm:text-base">
            مدیریت سفارشات
          </p>
        </div>
        <table className="w-full max-w-[1000px] mx-auto border-collapse border border-gray-300 text-center">
          <thead className="bg-gray-100 text-gray-800">
            <tr className="border-b border-gray-300">
              <th
                className="p-2 text-xs sm:text-sm font-medium cursor-pointer"
                onClick={() => handleSort('actions')}
              >
                عملیات
              </th>
              <th
                className="p-2 text-xs sm:text-sm font-medium cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                زمان ثبت سفارش
                {sortColumn === 'createdAt' &&
                  (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
              <th
                className="p-2 text-xs sm:text-sm font-medium cursor-pointer"
                onClick={() => handleSort('totalPrice')}
              >
                مجموع مبلغ
                {sortColumn === 'totalPrice' &&
                  (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
              <th
                className="p-2 text-xs sm:text-sm font-medium cursor-pointer"
                onClick={() => handleSort('user')}
              >
                نام کاربر
                {sortColumn === 'user' &&
                  (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
            </tr>
          </thead>

          <tbody>
            {AllOrders.data?.data.orders.map((p, index) => (
              <tr
                key={p._id}
                className={`${
                  index % 2 === 0 ? 'bg-teal-50' : 'bg-white'
                } hover:bg-gray-50`}
              >
                <td className="p-1">
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      classname="w-14 h-6 text-[9px] sm:text-xs   text-nowrap text-slate-700 font-semibold sm:w-20 sm:h-8  border border-teal-500 flex justify-center hover:bg-teal-500 hover:text-white"
                      text="برسی سفارش"
                      onClick={() => {
                        setorderId(p._id);
                      }}
                    />
                  </div>
                </td>
                <td className="p-1 text-xs text-slate-700 font-semibold">
                  {convertToJalali(p.createdAt)}
                </td>
                <td className="p-1 px-1 text-xs sm:text-sm text-gray-800 font-semibold">
                  {p.totalPrice}
                </td>
                <td className="p-1 px-2 text-xs sm:text-sm text-gray-700 font-medium">
                  {information &&
                    information.data.users.find(e => e._id === p.user)
                      ?.firstname}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <section className="w-full max-w-[900px] flex flex-row justify-around">
          <Button
            classname="border-teal-500 text-xs text-slate-700 sm:text-sm font-semibold text-nowrap h-7 w-20 justify-center my-3"
            text="صفحه قبل"
            onClick={() =>
              Pageproduct > 1 && setPageproduct(Number(Pageproduct) - 1)
            }
          />
          <div className="w-full max-w-[100px] flex flex-row gap-x-3 justify-center items-center cursor-pointer ">
            {visiblePages.map(p => (
              <>
                <div
                  className={ClassNames(
                    `${p === Pageproduct && ' bg-teal-500  hidden sm:flex text-white px-3 pb-[2px] w-7 h-7 rounded-full  justify-center items-center'}`,
                  )}
                >
                  <p
                    className="text-xs font-semibold text-slate-700 sm:text-sm hover:underline hidden sm:block"
                    onClick={() => {
                      setPageproduct(p);
                    }}
                  >
                    {p}
                  </p>
                </div>
              </>
            ))}
            <p className="text-xs font-bold absolute  text-slate-700 sm:hidden">
              {Pageproduct}
            </p>
          </div>
          <Button
            classname="border-teal-500 text-slate-700 text-xs sm:text-sm font-semibold text-nowrap h-7 w-20 justify-center my-3"
            text="صفحه بعد"
            onClick={() =>
              Pageproduct < totalpagesArrayForProduct.length &&
              setPageproduct(Number(Pageproduct) + 1)
            }
          />
        </section>
      </section>
      {orderId !== null && (
        <ModalForEdite>
          {AllOrders.data?.data.orders
            .filter(a => a._id == orderId)
            .map(o => (
              <section className="w-full flex flex-col gap-y-3">
                <div className="text-slate-700 space-y-2 pb-4">
                  <p className="font-semibold text-lg">
                    وضعیت
                    <span className="text-green-500">
                      {o.deliveryStatus == true
                        ? ' تحویل شده '
                        : ' تحویل نشده '}
                    </span>
                    می باشد
                  </p>
                  <p>آیا می خواهید وضعیت را تغییر دهید؟</p>
                </div>
                <div className="w-full max-w-96 max-h-72 noscrollbar overflow-y-scroll">
                  <table className="w-full max-w-[1000px] mx-auto border-collapse border border-gray-300 text-center">
                    <thead className="bg-gray-100 text-gray-800">
                      <tr className="border-b border-gray-300">
                        <th className="p-2 text-xs sm:text-sm font-medium">
                          لیست سفارشات
                        </th>
                        <th className="p-2 text-xs sm:text-sm font-medium">
                          ترتیب
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {AllOrders.data?.data.orders
                        .filter(u => u.user === o.user)
                        .map((or, index) => (
                          <tr
                            key={or._id}
                            className={`${
                              index % 2 === 0 ? 'bg-teal-50' : 'bg-white'
                            } hover:bg-gray-50`}
                          >
                            <td className="p-2 text-xs sm:text-sm text-gray-700 font-semibold  ">
                              {or.products.map(p => (
                                <ProductName
                                  key={p.product}
                                  productId={p.product}
                                />
                              ))}
                            </td>
                            <td className="p-2 text-xs sm:text-sm text-gray-700 font-semibold">
                              {index + 1}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-span-4 w-full gap-x-4 grid grid-cols-2 justify-items-center pt-2">
                  {o.deliveryStatus == true ? (
                    <button
                      onClick={() => handeldeliveryStatus(false, orderId)}
                      className=" border border-orange-600 rounded-md text-xs sm:text-sm w-20 h-7 sm:w-36 flex justify-center items-center sm:h-10 bg-orange-500 hover:bg-orange-400 text-white font-semibold"
                    >
                      تغییر به تحویل نشده
                    </button>
                  ) : (
                    <button
                      onClick={() => handeldeliveryStatus(true, orderId)}
                      className=" border border-green-600 rounded-md text-xs sm:text-sm w-20 h-7 sm:w-36 flex justify-center items-center sm:h-10 bg-green-500 hover:bg-green-400 text-white font-semibold"
                    >
                      تغییر به تحویل شده
                    </button>
                  )}
                  <button
                    onClick={() => setorderId(null)}
                    className=" border border-red-600 rounded-md text-xs sm:text-sm w-20 h-7 sm:w-36 flex justify-center items-center sm:h-10 bg-red-500 hover:bg-red-400 text-white font-semibold"
                  >
                    بستن
                  </button>
                </div>
              </section>
            ))}
        </ModalForEdite>
      )}
    </main>
  );
};
export default OrderForAdmin;
