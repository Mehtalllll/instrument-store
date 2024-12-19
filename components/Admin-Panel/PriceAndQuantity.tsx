'use client';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetEditeProduct } from '@/apis/EditProduct';
import { fetchAllproduct } from '@/apis/AllProduct';
import Button from '../Global/Button';
import Input from '../Global/Input';
import toast from 'react-hot-toast';
import { ClassNames } from '@/utils/classname-join';
import { useQuery } from 'react-query';

const PriceAndQuantity: React.FC = () => {
  const [Pageproduct, setPageproduct] = React.useState<number>(1);
  const [editedProducts, setEditedProducts] = React.useState<
    Record<string, any>
  >({});
  const [editFields, setEditFields] = React.useState<
    Record<string, { price: boolean; quantity: boolean }>
  >({});

  const EditSchema = z.object({
    price: z
      .union([z.string(), z.number()])
      .refine(val => !isNaN(Number(val)), {
        message: 'قیمت باید عددی باشد',
      }),
    quantity: z
      .union([z.string(), z.number()])
      .refine(val => !isNaN(Number(val)), {
        message: 'موجودی باید عددی باشد',
      }),
  });

  type EditFormInputs = z.infer<typeof EditSchema>;

  const EditForm = useForm<EditFormInputs>({
    resolver: zodResolver(EditSchema),
  });

  const onFieldChange = (id: string, field: string, value: string | number) => {
    setEditedProducts(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const toggleEditField = (id: string, field: 'price' | 'quantity') => {
    setEditFields(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: !prev[id]?.[field],
      },
    }));
  };

  const Allproduct = useQuery(
    ['Products', Pageproduct, editFields, editedProducts],
    () => fetchAllproduct({ page: Pageproduct }),
    { keepPreviousData: true, staleTime: 5000 },
  );

  const totalpagesArrayForProduct = [];
  for (let i = 1; i <= Number(Allproduct.data?.total_pages); i++) {
    totalpagesArrayForProduct.push(i);
  }
  const saveAllEdits = async () => {
    try {
      for (const id in editedProducts) {
        const formData = new FormData();
        const changes = editedProducts[id];
        if (changes.price) formData.append('price', changes.price.toString());
        if (changes.quantity)
          formData.append('quantity', changes.quantity.toString());
        await GetEditeProduct(formData, id);
        toast.success(
          <p className="text-xs font-semibold">
            ${Allproduct.data?.data.products.find(i => i._id == id)?.name} با
            موفقیت بروز رسانی شد
          </p>,
        );
      }
      setEditedProducts({});
      setEditFields({});
      toast.success('تمام تغییرات ذخیره شد');
    } catch (error) {
      console.error(error);
      toast.error('خطا در ذخیره تغییرات');
    }
  };

  const maxVisiblePages = 5; // تعداد صفحات قابل نمایش در یک زمان

  const visiblePages = React.useMemo(() => {
    const total = Number(Allproduct.data?.total_pages) || 1;
    const startPage = Math.max(
      1,
      Pageproduct - Math.floor(maxVisiblePages / 2),
    );
    const endPage = Math.min(total, startPage + maxVisiblePages - 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }, [Pageproduct, Allproduct.data?.total_pages]);
  return (
    <>
      <div className="p-4 flex flex-col gap-y-3">
        <section className="w-full max-w-[1000px] mx-auto bg-white rounded-md shadow-md h-fit py-2 px-3">
          <div className="flex justify-between py-2 ">
            <Button
              onClick={saveAllEdits}
              text="ذخیره "
              classname={ClassNames(
                'border-green-300 text-xs text-white w-[110px] flex',
                ' justify-center h-7 font-semibold bg-teal-500 hover:bg-teal-400',
                'sm:w-28 sm:h-8 lg:w-36 sm:text-sm text-nowrap',
              )}
            />
            <p className="text-sm font-bold text-slate-700 sm:text-base">
              مدیریت موجودی و قیمت ها
            </p>
          </div>
          <table className="w-full max-w-[1000px] mx-auto border-collapse border border-gray-300 text-center">
            <thead className="bg-gray-100 text-gray-800">
              <tr className="border-b border-gray-300">
                <th className="p-2 text-xs sm:text-sm font-medium">قیمت</th>
                <th className="p-2 text-xs sm:text-sm font-medium">موجودی</th>
                <th className="p-2 text-xs sm:text-sm font-medium">
                  نام محصول
                </th>
              </tr>
            </thead>
            <tbody>
              {Allproduct &&
                Allproduct.data?.data.products.map((p: any, index: number) => (
                  <tr
                    key={p._id}
                    className={`${
                      index % 2 === 0 ? 'bg-teal-50' : 'bg-white'
                    } hover:bg-gray-50`}
                  >
                    <td
                      className="p-2 text-[10px] font-semibold sm:text-sm cursor-pointer"
                      onClick={() => toggleEditField(p._id, 'price')}
                    >
                      {editFields[p._id]?.price ? (
                        <div className="w-full max-w-36 mx-auto">
                          <Input
                            name={`price-${p._id}`}
                            placeholder="Enter price"
                            register={EditForm.register}
                            defaultValue={p.price}
                            onClick={e => e.stopPropagation()} // جلوگیری از اجرای onClick والد
                            onFocus={e => e.stopPropagation()} // جلوگیری از رویداد focus
                            onChange={e =>
                              onFieldChange(p._id, 'price', e.target.value)
                            }
                          />
                        </div>
                      ) : (
                        p.price
                      )}
                    </td>
                    <td
                      className="p-2 text-[10px] font-semibold sm:text-sm cursor-pointer"
                      onClick={() => toggleEditField(p._id, 'quantity')}
                    >
                      {editFields[p._id]?.quantity ? (
                        <div className="w-full max-w-36 mx-auto">
                          <Input
                            name={`quantity-${p._id}`}
                            placeholder="Enter quantity"
                            register={EditForm.register}
                            defaultValue={p.quantity}
                            onClick={e => e.stopPropagation()} // جلوگیری از اجرای onClick والد
                            onFocus={e => e.stopPropagation()} // جلوگیری از رویداد focus
                            onChange={e =>
                              onFieldChange(p._id, 'quantity', e.target.value)
                            }
                          />
                        </div>
                      ) : (
                        p.quantity
                      )}
                    </td>
                    <td className="p-1 px-3 text-xs sm:text-sm text-gray-800 font-semibold">
                      {p.name}
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
      </div>
    </>
  );
};

export default PriceAndQuantity;
