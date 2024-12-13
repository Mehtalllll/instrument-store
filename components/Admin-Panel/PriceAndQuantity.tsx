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
import ModalForEdite from '../Global/Edite-modal';

const PriceAndQuantity: React.FC = () => {
  const [Pageproduct, setPageproduct] = React.useState<number>(1);
  const [Allproduct, setAllproduct] = React.useState<any>(null);
  const [EditId, setEditId] = React.useState<string | null>(null);

  const totalpagesArrayForProduct = [];
  for (let i = 1; i <= Number(Allproduct?.total_pages); i++) {
    totalpagesArrayForProduct.push(i);
  }

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

  const onSubmitEditForList: SubmitHandler<EditFormInputs> = async data => {
    const formData = new FormData();
    formData.append('price', data.price.toString());
    formData.append('quantity', data.quantity.toString());
    try {
      await GetEditeProduct(formData, EditId);
      setEditId(null);
      toast.success('تغییرات ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تغییرات');
      console.error(error);
    }
  };

  React.useEffect(() => {
    const loadAllproduct = async (Pageproduct: number) => {
      const result = await fetchAllproduct({ page: Pageproduct });
      setAllproduct(result);
    };

    loadAllproduct(Pageproduct);
  }, [Pageproduct, EditId]);

  React.useEffect(() => {
    if (EditId && Allproduct) {
      const product = Allproduct.data.products.find(
        (p: any) => p._id === EditId,
      );
      if (product) {
        EditForm.reset({
          price: product.price,
          quantity: product.quantity,
        });
      }
    }
  }, [EditId, Allproduct, EditForm]);

  return (
    <>
      <div className="p-4 flex flex-col gap-y-3">
        <section className="w-full max-w-[1000px] mx-auto bg-white rounded-md shadow-md h-fit py-2 px-3">
          <div className="flex justify-end py-2 ">
            <p className="text-sm font-bold text-slate-700 sm:text-base">
              مدیریت موجودی و قیمت ها
            </p>
          </div>
          <form onSubmit={EditForm.handleSubmit(onSubmitEditForList)}>
            <table className="w-full max-w-[1000px] mx-auto border-collapse border border-gray-300 text-center">
              <thead className="bg-gray-100 text-gray-800">
                <tr className="border-b  border-gray-300">
                  <th className="p-2 text-xs sm:text-sm font-medium">عملیات</th>
                  <th className="p-2 text-xs sm:text-sm font-medium">
                    نام محصول
                  </th>
                  <th className="p-2 text-xs sm:text-sm font-medium">قیمت</th>
                  <th className="p-2 text-xs sm:text-sm font-medium">موجودی</th>
                </tr>
              </thead>

              <tbody>
                {Allproduct &&
                  Allproduct.data.products.map((p: any, index: number) => (
                    <tr
                      key={p._id}
                      className={`${
                        index % 2 === 0 ? 'bg-teal-50' : 'bg-white'
                      } hover:bg-gray-50`}
                    >
                      <td className="p-2">
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <Button
                            classname="w-14 h-6 text-xs text-slate-700 sm:font-semibold sm:w-20 sm:h-8  border border-teal-500 flex justify-center hover:bg-teal-500 hover:text-white"
                            text="ذخیره"
                            onClick={() => setEditId(p._id)}
                          />
                        </div>
                      </td>

                      <td
                        className="p-2 text-[10px]  font-semibold sm:text-sm"
                        onClick={() => setEditId(p._id)}
                      >
                        {EditId === p._id ? (
                          <div className="w-full max-w-20 mx-auto">
                            <Input
                              name="price"
                              placeholder="Enter price"
                              register={EditForm.register}
                              required={false}
                              error={EditForm.formState.errors.price}
                            />
                          </div>
                        ) : (
                          p.price
                        )}
                      </td>
                      <td
                        className="p-2 text-[10px]  font-semibold sm:text-sm"
                        onClick={() => setEditId(p._id)}
                      >
                        {EditId === p._id ? (
                          <div className="w-full max-w-20 mx-auto">
                            <Input
                              name="quantity"
                              placeholder="Enter quantity"
                              register={EditForm.register}
                              required={false}
                              error={EditForm.formState.errors.quantity}
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
          </form>
          <section className="w-full max-w-[900px] flex flex-row justify-around ">
            <Button
              classname="border-teal-500 text-xs sm:text-sm text-slate-700 font-semibold text-nowrap h-7 w-20 justify-center my-3"
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
              classname="border-teal-500 text-xs sm:text-sm text-slate-700 font-semibold text-nowrap h-7 w-20 justify-center my-3"
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
