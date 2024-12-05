'use client';
import { fetchAllOrders } from '@/apis/AllOrders';
import { fetchAllproduct } from '@/apis/AllProduct';
import { fetchDelproduct } from '@/apis/DeleteProduct';
import { GetEditeProduct } from '@/apis/EditProduct';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { RootState } from '@/Redux/store';
import { IResOrders } from '@/types/Orders';
import { IProductsList } from '@/types/Product';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { any, string, z } from 'zod';

const EditSchema = z.object({
  name: z.string().min(1, 'نام محصول الزامی است'),
  price: z.string().regex(/^\d+$/, 'قیمت باید عدد باشد'),
  quantity: z.string().regex(/^\d+$/, 'تعداد باید عدد باشد'),
  brand: z.string().min(1, 'نام تجاری الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  thumbnail: z.string(),
  images: z.any(), // قبول فایل
});

type EditFormInputs = z.infer<typeof EditSchema>;

const AdminPanel: React.FC = () => {
  const [Allproduct, setAllproduct] = React.useState<IProductsList>();
  const [AllOrders, setAllOrders] = React.useState<IResOrders>();
  const [EditId, setEditId] = React.useState<string | null>(null);
  const [Pageproduct, setPageproduct] = React.useState<number>(1);
  const [PageOrders, setPageOrders] = React.useState<number>(1);
  const [filters, setFilters] = React.useState({
    name: 'ibanez', // فیلتر نام محصول
    minPrice: '', // فیلتر حداقل قیمت
    maxPrice: '', // فیلتر حداکثر قیمت
  });
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

  console.log(AllOrders);

  // وقتی EditId تغییر می‌کند، مقادیر فرم را مقداردهی اولیه کن
  React.useEffect(() => {
    if (EditId && Allproduct) {
      const product = Allproduct.data.products.find(p => p._id === EditId);
      if (product) {
        EditForm.reset({
          name: product.name,
          price: product.price.toString(),
          quantity: product.quantity.toString(),
          brand: product.brand,
          description: product.description,
          thumbnail: product.thumbnail,
        });
      }
    }
  }, [EditId, Allproduct, EditForm]);

  // هندل کردن سابمیت فرم
  const onSubmitEdit: SubmitHandler<EditFormInputs> = async data => {
    console.log('Form Data:', data);
    // ارسال داده به سرور (مثلاً API)
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('quantity', data.quantity);
    formData.append('brand', data.brand);
    formData.append('description', data.description);
    if (data.images && data.images[0]) {
      formData.append('images', data.images[0]);
    }
    console.log(formData);
    GetEditeProduct(formData, EditId);
  };

  return (
    <main className="container mx-auto  ">
      {activity === 'مدیریت محصولات' && (
        <div className="p-5 flex flex-col gap-y-3">
          <section className="bg-white rounded-md shadow-md w-full h-fit p-4">
            <table className="min-w-full border-collapse border border-gray-300 text-center">
              <thead className="bg-gray-100 text-gray-800">
                <tr className="border-b border-gray-300">
                  <th className="p-3 font-medium">عملیات</th>
                  <th className="p-3 font-medium">قیمت</th>
                  <th className="p-3 font-medium">تعداد</th>
                  <th className="p-3 font-medium">تصویر</th>
                  <th className="p-3 font-medium">نام محصول</th>
                </tr>
              </thead>

              <tbody>
                {Allproduct &&
                  filteredData.map((p, index) => (
                    <tr
                      key={p._id}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-gray-50`}
                    >
                      <td className="p-3">
                        <div className="flex gap-2 justify-center">
                          <Button
                            classname="w-20 border border-blue-500 flex justify-center hover:bg-blue-500 hover:text-white"
                            text="ویرایش"
                            onClick={() => setEditId(p._id)}
                          />
                          <Button
                            onClick={() => fetchDelproduct(p._id)}
                            classname="w-20 border border-red-500 flex justify-center hover:bg-red-500 hover:text-white"
                            text="حذف"
                          />
                        </div>
                      </td>

                      <td className="p-3 text-gray-700 font-medium">
                        {p.price} تومان
                      </td>

                      <td className="p-3 text-gray-700">{p.quantity}</td>

                      <td className="p-3">
                        <img
                          src={`http://localhost:8000/images/products/images/${p.images[0]}`}
                          alt={p.images[0]}
                          width={50}
                          className="mx-auto rounded-md shadow-sm"
                        />
                      </td>

                      <td className="p-3 text-gray-800 font-semibold">
                        {p.name}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>

          {EditId !== null && (
            <section className="bg-gray-100 rounded-md border-2 border-slate-700 w-full h-fit p-5">
              <form
                onSubmit={EditForm.handleSubmit(onSubmitEdit)}
                className="grid grid-cols-4 gap-2 "
              >
                <Input
                  name="price"
                  label=":قیمت "
                  placeholder="Enter price"
                  register={EditForm.register}
                  required={false}
                  error={EditForm.formState.errors.price}
                />
                <Input
                  name="quantity"
                  label=":تعداد "
                  placeholder="Enter quantity"
                  register={EditForm.register}
                  required={false}
                  error={EditForm.formState.errors.quantity}
                />
                <Input
                  name="brand"
                  label=":نام تجاری "
                  placeholder="Enter brand"
                  register={EditForm.register}
                  required={false}
                  error={EditForm.formState.errors.brand}
                />

                <Input
                  name="name"
                  label=":نام محصول"
                  placeholder="Enter name"
                  register={EditForm.register}
                  required={false}
                  error={EditForm.formState.errors.name}
                />

                <div className="col-span-3 ">
                  <div className="w-full flex flex-col gap-y-2 items-end px-6 ">
                    <label className="text-slate-700" htmlFor="description">
                      :توضیحات{' '}
                    </label>
                    <textarea
                      className="w-full rounded-md border-2 border-slate-300 h-40 text-right p-1 text-sm "
                      id="description"
                      {...EditForm.register('description')}
                    />
                    {EditForm.formState.errors.description && (
                      <p className="text-red-500">
                        {EditForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="border-2 border-slate-500 rounded-md border-dashed w-full mt-6 flex items-center  ">
                  <Input
                    type="file"
                    accept="image/*"
                    name="images"
                    label=":تصویر "
                    placeholder="Enter images"
                    register={EditForm.register}
                    required={false}
                  />
                </div>
                <div className="col-span-4 w-full grid grid-cols-2 justify-items-center pt-2">
                  <button
                    type="submit"
                    className=" border border-green-600 rounded-md w-36 flex justify-center items-center h-10 bg-green-500 hover:bg-green-400 text-white font-semibold"
                  >
                    ذخیره
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    type="submit"
                    className=" border border-red-600 rounded-md w-36 flex justify-center items-center h-10 bg-red-500 hover:bg-red-400 text-white font-semibold"
                  >
                    بستن
                  </button>
                </div>
              </form>
            </section>
          )}
          <section className="flex flex-row justify-around">
            <Button
              classname="border-blue-500 w-36 justify-center m-5"
              text="صفحه قبل"
              onClick={() => setPageproduct(Number(Pageproduct) - 1)}
            />
            <div className="flex flex-row gap-x-5 justify-center items-center cursor-pointer ">
              {totalpagesArrayForProduct.map(p => (
                <p
                  className="hover:underline"
                  onClick={() => {
                    setPageproduct(p);
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
            <Button
              classname="border-blue-500 w-36 justify-center m-5"
              text="صفحه بعد"
              onClick={() => setPageproduct(Number(Pageproduct) + 1)}
            />
          </section>
        </div>
      )}

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
                        {o.user}
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
