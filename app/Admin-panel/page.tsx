'use client';
import { fetchAllOrders } from '@/apis/AllOrders';
import { fetchAllproduct } from '@/apis/AllProduct';
import { getAllUserData } from '@/apis/AllUserData';
import PriceAndQuantity from '@/components/Admin-Panel/PriceAndQuantity';
import ProductContainer from '@/components/Admin-Panel/product';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { RootState } from '@/Redux/store';
import { IResUserlist } from '@/types/Alluser';
import { IResOrders } from '@/types/Orders';
import { IProductsList } from '@/types/Product';
import { ClassNames } from '@/utils/classname-join';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';

const EditSchema = z.object({
  name: z.string().min(1, 'نام محصول الزامی است'),
  price: z.string().regex(/^\d+$/, 'قیمت باید عدد باشد'),
  quantity: z.string().regex(/^\d+$/, 'تعداد باید عدد باشد'),
  brand: z.string().min(1, 'نام تجاری الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  thumbnail: z.string(),
  images: z.any(), // قبول فایل
  subcategory: z.string(),
});

type EditFormInputs = z.infer<typeof EditSchema>;

const AdminPanel: React.FC = () => {
  const [Allproduct, setAllproduct] = React.useState<IProductsList>();
  const [AllOrders, setAllOrders] = React.useState<IResOrders>();
  const [Pageproduct, setPageproduct] = React.useState<number>(1);
  const [PageOrders, setPageOrders] = React.useState<number>(1);
  const [information, setInformation] = React.useState<IResUserlist>();
  const [filters, setFilters] = React.useState({
    name: ' ', // فیلتر نام محصول
  });
  const [EditePriceAndQuantity, setEditePriceAndQuantity] = React.useState<
    string | null
  >(null);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  const filteredData = React.useMemo(() => {
    if (!Allproduct) return [];
    return Allproduct.data.products.filter(product => {
      const matchesName =
        filters.name &&
        product.name.toLowerCase().includes(filters.name.toLowerCase());

      return matchesName;
    });
  }, [Allproduct, filters]);

  const activity = useSelector((state: RootState) => state.activity);

  const totalpagesArrayForProduct = [];
  for (let i = 1; i <= Number(Allproduct?.total_pages); i++) {
    totalpagesArrayForProduct.push(i);
  }
  const totalpagesArrayFororders = [];
  for (let i = 1; i <= Number(AllOrders?.total_pages); i++) {
    totalpagesArrayFororders.push(i);
  }

  const EditForm = useForm<EditFormInputs>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      name: '',
      price: '',
      quantity: '',
      brand: '',
      description: '',
      thumbnail: '',
      subcategory: '',
    },
  });

  React.useEffect(() => {
    const loadAllproduct = async (Pageproduct: number) => {
      const result: IProductsList = await fetchAllproduct(Pageproduct);
      setAllproduct(result);
    };

    loadAllproduct(Pageproduct);
  }, [Pageproduct]);

  React.useEffect(() => {
    const loadAllOrders = async (PageOrders: number) => {
      const resultorders: IResOrders = await fetchAllOrders(PageOrders);
      setAllOrders(resultorders);
    };
    loadAllOrders(PageOrders);
  }, [PageOrders]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data: IResUserlist = await getAllUserData();
      setInformation(data);
    };

    fetchData();
  }, [PageOrders]);

  const onSubmitEditForPrice: SubmitHandler<EditFormInputs> = async data => {
    console.log('Form Data:', data);
    const formData = new FormData();
    formData.append('price', data.price);
    formData.append('quantity', data.quantity);
    console.log(formData);
    // GetEditeProduct(formData, EditePriceAndQuantity);
  };

  console.log(information);

  return (
    <main className="container mx-auto ">
      {activity === 'کالاها' && <ProductContainer />}
      {activity === 'موجودی و قیمت ها' && <PriceAndQuantity />}

      {activity === 'سفارشات' && (
        <div className="p-5 flex flex-col gap-y-3">
          <section className="bg-white rounded-md shadow-md w-full h-fit p-4">
            <table className="w-full border-collapse border border-gray-300 text-center">
              {/* Header */}
              <thead className="bg-gray-100 text-gray-800">
                <tr className="border-b border-gray-300">
                  <th className="p-3 font-medium">عملیات</th>
                  <th className="p-3 font-medium">شناسه کاربر</th>
                  <th className="p-3 font-medium">تاریخ ایجاد</th>
                  <th className="p-3 font-medium">تاریخ تحویل</th>
                  <th className="p-3 font-medium">وضعیت تحویل</th>
                  <th className="p-3 font-medium">مجموع قیمت</th>
                  <th className="p-3 font-medium">تاریخ بروزرسانی</th>
                  <th className="p-3 font-medium">محصولات</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {AllOrders &&
                  AllOrders.data.orders.map((o, index) => (
                    <tr
                      key={o._id}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-gray-100`}
                    >
                      {/* عملیات */}
                      <td className="p-3 border border-gray-300">
                        <div className="flex gap-2 justify-center">
                          <Button
                            classname="px-3 py-1 border flex justify-center border-blue-500 rounded-md hover:bg-blue-500 hover:text-white"
                            text="ویرایش"
                          />
                          <Button
                            classname="px-3 py-1 border flex justify-center border-red-500 rounded-md hover:bg-red-500 hover:text-white"
                            text="حذف"
                          />
                        </div>
                      </td>

                      {/* شناسه کاربر */}
                      <td className="p-3  border border-gray-300 text-xs">
                        {information &&
                          information.data.users.find(e => e._id === o.user)
                            ?.firstname}
                      </td>

                      {/* تاریخ ایجاد */}
                      <td className="p-3 text-sm border border-gray-300">
                        {o.createdAt}
                      </td>

                      {/* تاریخ تحویل */}
                      <td className="p-3 text-sm border border-gray-300">
                        {o.deliveryDate || '-'}
                      </td>

                      {/* وضعیت تحویل */}
                      <td className="p-3 text-sm border border-gray-300">
                        {o.deliveryStatus || '-'}
                      </td>

                      {/* مجموع قیمت */}
                      <td className="p-3 text-sm border border-gray-300 font-medium">
                        {o.totalPrice} تومان
                      </td>

                      {/* تاریخ بروزرسانی */}
                      <td className="text-xs font-semibold p-3 border border-gray-300">
                        {o.updatedAt}
                      </td>

                      {/* محصولات */}
                      <td className="p-3 border border-gray-300 text-left">
                        {o.products.map((product, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 border flex flex-col justify-end items-end border-gray-200 rounded p-2 my-2"
                          >
                            <p className="text-sm font-semibold">
                              تعداد: {product.count}
                            </p>
                            <p className="text-xs  font-semibold">
                              {product.product}:شناسه محصول
                            </p>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
          <section className="flex flex-row justify-around">
            <Button
              classname="border-blue-500 w-36 justify-center m-5"
              text="صفحه قبل"
              onClick={() => setPageOrders(Number(PageOrders) - 1)}
            />
            <div className="flex flex-row gap-x-5 justify-center items-center cursor-pointer ">
              {totalpagesArrayFororders.map(p => (
                <p
                  className="hover:underline"
                  onClick={() => {
                    setPageOrders(p);
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
            <Button
              classname="border-blue-500 w-36 justify-center m-5"
              text="صفحه بعد"
              onClick={() => setPageOrders(Number(PageOrders) + 1)}
            />
          </section>
        </div>
      )}
    </main>
  );
};

export default AdminPanel;
