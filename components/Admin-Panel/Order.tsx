import { IResOrders } from '@/types/Orders';
import React from 'react';
import Button from '../Global/Button';
import { IResUserlist } from '@/types/Alluser';
import { ClassNames } from '@/utils/classname-join';
import { fetchAllOrders } from '@/apis/AllOrders';
import { getAllUserData } from '@/apis/AllUserData';

const OrderForAdmin: React.FC = () => {
  const [AllOrders, setAllOrders] = React.useState<IResOrders>();
  const [Pageproduct, setPageproduct] = React.useState<number>(1);
  const [information, setInformation] = React.useState<IResUserlist>();
  const [deliveryStatus, setdeliveryStatus] = React.useState<{
    all: boolean;
    delivered: boolean;
    Notdelivered: boolean;
  }>({ delivered: false, Notdelivered: false, all: true });

  const filteredData = React.useMemo(() => {
    if (!AllOrders || !AllOrders.data || !AllOrders.data.orders) return [];
    return AllOrders.data.orders.filter(product => {
      if (deliveryStatus.all) {
        return true;
      }
      if (deliveryStatus.delivered && product.deliveryStatus) {
        return true;
      }
      if (deliveryStatus.Notdelivered && !product.deliveryStatus) {
        return true;
      }
      return false;
    });
  }, [AllOrders, deliveryStatus]);

  const moment = require('jalali-moment');

  function convertToJalali(isoDate: string) {
    // تبدیل تاریخ به فرمت Moment
    const date = moment(isoDate);

    // تبدیل به تاریخ شمسی
    const jalaliDate = date.locale('fa').format('YYYY/MM/DD HH:mm:ss');

    return jalaliDate;
  }

  const isoDate = '2024-12-05T01:10:23.486Z';
  const jalaliDate = convertToJalali(isoDate);

  const totalpagesArrayForProduct = [];
  for (let i = 1; i <= Number(AllOrders?.total_pages); i++) {
    totalpagesArrayForProduct.push(i);
  }

  React.useEffect(() => {
    const loadAllOrders = async (Pageproduct: number) => {
      const resultorders: IResOrders = await fetchAllOrders(Pageproduct);
      setAllOrders(resultorders);
    };
    loadAllOrders(Pageproduct);
  }, [Pageproduct]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data: IResUserlist = await getAllUserData();
      setInformation(data);
    };

    fetchData();
  }, [Pageproduct]);

  return (
    <main className="pt-4">
      <section className="w-full max-w-[1000px] mx-auto bg-white rounded-md shadow-md  h-fit pt-2 px-4">
        <div className="flex justify-between py-2">
          <div className="flex flex-col sm:flex-row  gap-y-2 ">
            <div>
              <input
                type="checkbox"
                id="all"
                checked={deliveryStatus.all}
                onChange={() =>
                  setdeliveryStatus({
                    all: true,
                    delivered: false,
                    Notdelivered: false,
                  })
                }
              />
              <label
                htmlFor="all"
                className={`ml-2 cursor-pointer text-xs sm:text-sm font-semibold px-4  ${
                  deliveryStatus.all ? 'text-teal-500 ' : 'text-slate-700 '
                }`}
              >
                همه کالاها
              </label>
            </div>

            <div>
              <input
                type="checkbox"
                id="delivered"
                checked={deliveryStatus.delivered}
                onChange={() =>
                  setdeliveryStatus({
                    all: false,
                    delivered: true,
                    Notdelivered: false,
                  })
                }
              />
              <label
                htmlFor="delivered"
                className={`ml-2 cursor-pointer text-xs sm:text-sm font-semibold px-4 py-2 ${
                  deliveryStatus.delivered
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
                checked={deliveryStatus.Notdelivered}
                onChange={() =>
                  setdeliveryStatus({
                    all: false,
                    delivered: false,
                    Notdelivered: true,
                  })
                }
              />
              <label
                htmlFor="notDelivered"
                className={`ml-2 cursor-pointer text-xs sm:text-sm font-semibold px-4 py-2 ${
                  deliveryStatus.Notdelivered
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
            <tr className="border-b  border-gray-300">
              <th className="p-2 text-xs sm:text-sm font-medium">عملیات</th>
              <th className="p-2 text-xs sm:text-sm font-medium">
                زمان ثبت سفارش
              </th>
              <th className="p-2 text-xs sm:text-sm font-medium">مجموع مبلغ</th>
              <th className="p-2 text-xs sm:text-sm font-medium">نام کاربر</th>
            </tr>
          </thead>

          <tbody>
            {AllOrders &&
              filteredData.map((p, index) => (
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
                        onClick={() => {}}
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
            classname="border-teal-500 text-xs sm:text-sm font-semibold text-slate-700 text-nowrap h-7 w-20 justify-center my-3"
            text="صفحه قبل"
            onClick={() =>
              Pageproduct > 1 && setPageproduct(Number(Pageproduct) - 1)
            }
          />
          <div className="w-full max-w-[100px] flex flex-row gap-x-3 justify-center items-center cursor-pointer ">
            {totalpagesArrayForProduct.map(p => (
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
            <p className="text-xs font-bold absolute text-slate-700 sm:hidden">
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
    </main>
  );
};
export default OrderForAdmin;
