'use client';
import { z } from 'zod';
import React from 'react';
import ModalForEdite from '../Edite-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { fetchCategories } from '@/apis/categories';
import { GetEditeProduct } from '@/apis/EditProduct';
import { fetchDelproduct } from '@/apis/DeleteProduct';
import { fetchSubCategories } from '@/apis/subcategories';

import { IProductsList } from '@/types/Product';
import { IRescategories } from '@/types/categories';
import { IRessubcategories } from '@/types/subcategories';

import Input from '../Input';
import Button from '../Button';
import { fetchAllproduct } from '@/apis/AllProduct';
import toast from 'react-hot-toast';

const ProductContainer: React.FC = () => {
  //   const [filters, setFilters] = React.useState({ name: ' ' });
  const [Pageproduct, setPageproduct] = React.useState<number>(1);
  const [EditId, setEditId] = React.useState<string | null>(null);
  const [Allproduct, setAllproduct] = React.useState<IProductsList>();
  const [categories, setcategories] = React.useState<IRescategories>();
  const [subcategories, setsubcategories] = React.useState<IRessubcategories>();

  const totalpagesArrayForProduct = [];
  for (let i = 1; i <= Number(Allproduct?.total_pages); i++) {
    totalpagesArrayForProduct.push(i);
  }

  //   const filteredData = React.useMemo(() => {
  //     if (!Allproduct) return [];
  //     return Allproduct.data.products.filter(product => {
  //       const matchesName =
  //         filters.name &&
  //         product.name.toLowerCase().includes(filters.name.toLowerCase());

  //       return matchesName;
  //     });
  //   }, [Allproduct, filters]);

  const EditSchema = z.object({
    name: z.string().min(1, 'نام محصول الزامی است'),
    description: z.string().min(1, 'توضیحات الزامی است'),
    images: z.any(), // قبول فایل
    subcategory: z.string(),
  });

  type EditFormInputs = z.infer<typeof EditSchema>;

  const EditForm = useForm<EditFormInputs>({
    resolver: zodResolver(EditSchema),
  });

  const onSubmitEditForList: SubmitHandler<EditFormInputs> = async data => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('subcategory', data.subcategory);
    formData.append('description', data.description);
    if (data.images && data.images[0]) {
      formData.append('images', data.images[0]);
    }
    try {
      await GetEditeProduct(formData, EditId);

      setEditId(null);
      toast.success('تغییرات ذخیره شد');
    } catch (error) {
      toast.error(`${error}`);
      console.error(error);
    }
  };

  React.useEffect(() => {
    const loadAllproduct = async (Pageproduct: number) => {
      const result: IProductsList = await fetchAllproduct(Pageproduct);
      setAllproduct(result);
    };

    loadAllproduct(Pageproduct);
  }, [Pageproduct, EditId]);

  React.useEffect(() => {
    if (EditId && Allproduct) {
      const product = Allproduct.data.products.find(p => p._id === EditId);
      if (product) {
        EditForm.reset({
          name: product.name,
          description: product.description,
          subcategory: product.subcategory,
        });
      }
    }
  }, [EditId, Allproduct, EditForm]);

  React.useEffect(() => {
    const loadCategories = async () => {
      const result: IRescategories = await fetchCategories();
      setcategories(result);
    };
    const loadsubCategories = async () => {
      const result2: IRessubcategories = await fetchSubCategories();
      setsubcategories(result2);
    };

    loadCategories();
    loadsubCategories();
  }, []);

  return (
    <>
      <div className="p-5 flex flex-col gap-y-3">
        <section className="w-full max-w-[1000px] mx-auto bg-white rounded-md shadow-md  h-fit p-4">
          <div className="flex justify-between p-2">
            <Button
              text="افزودن کالا"
              classname="border-green-300 text-white w-36 flex justify-center font-semibold bg-green-500"
            />
            <p className="text-xl font-bold">مدیریت کالا</p>
          </div>
          <table className="w-full max-w-[1000px] mx-auto border-collapse border border-gray-300 text-center">
            <thead className="bg-gray-100 text-gray-800">
              <tr className="border-b border-gray-300">
                <th className="p-3 font-medium">عملیات</th>
                <th className="p-3 font-medium">دسته بندی</th>
                <th className="p-3 font-medium">نام محصول</th>
                <th className="p-3 font-medium">تصویر</th>
              </tr>
            </thead>

            <tbody>
              {Allproduct &&
                Allproduct.data.products.map((p, index) => (
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
                      {
                        categories?.data.categories.find(
                          c => c._id === p.category,
                        )?.name
                      }
                      /
                      {
                        subcategories?.data.subcategories.find(
                          c => c._id === p.subcategory,
                        )?.name
                      }
                    </td>

                    <td className="p-3 text-gray-800 font-semibold">
                      {p.name}
                    </td>
                    <td className="p-3">
                      <img
                        src={`http://localhost:8000/images/products/images/${p.images[0]}`}
                        alt={p.images[0]}
                        width={50}
                        className="mx-auto rounded-md shadow-sm"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        {EditId !== null && (
          <section>
            <ModalForEdite>
              <form
                onSubmit={EditForm.handleSubmit(onSubmitEditForList)}
                className="w-full grid grid-cols-2 gap-2 "
              >
                <div className="w-full flex flex-col gap-y-2 items-end px-6  ">
                  <label className="text-slate-700" htmlFor="description">
                    :توضیحات
                  </label>
                  <textarea
                    className="w-full rounded-md border-2 border-slate-300 h-[170px] text-right p-1 text-sm "
                    id="description"
                    {...EditForm.register('description')}
                  />
                  {EditForm.formState.errors.description && (
                    <p className="text-red-500">
                      {EditForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <Input
                    name="name"
                    label=":نام محصول"
                    placeholder="Enter name"
                    register={EditForm.register}
                    required={false}
                    error={EditForm.formState.errors.name}
                  />
                  <div className="w-full text-right px-6">
                    <label className="text-slate-700 font-semibold">
                      دسته بندی
                    </label>
                    <select
                      {...EditForm.register('subcategory')}
                      className="border max-h-[50px] overflow-y-auto relative z-10  border-slate-300  w-full max-w-[450px] rounded-md p-1 input text-right "
                    >
                      {categories?.data.categories.map(c => (
                        <optgroup key={c._id} label={c.name}>
                          {subcategories?.data.subcategories.map(
                            s =>
                              s.category === c._id && (
                                <option value={s._id} key={s._id}>
                                  {s.name}
                                </option>
                              ),
                          )}
                        </optgroup>
                      ))}
                    </select>
                  </div>

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
            </ModalForEdite>
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
    </>
  );
};

export default ProductContainer;
