'use client';
import { z } from 'zod';
import React from 'react';
import ModalForEdite from '../Global/Edite-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { GetEditeProduct } from '@/apis/EditProduct';
import { fetchDelproduct } from '@/apis/DeleteProduct';

import { Isubcategories } from '@/types/subcategories';

import Input from '../Global/Input';
import Button from '../Global/Button';
import { fetchAllproduct } from '@/apis/AllProduct';
import toast from 'react-hot-toast';
import { ClassNames } from '@/utils/classname-join';
import { GetAddProduct } from '@/apis/AddProduct';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import CategoriesAndSubcategoriesLoader from '@/Redux/Features/CategorieAndSubcategorie';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { TextEditor } from '../Global/Text-editor';
import { IProduct } from '@/types/Product';

const ProductContainer: React.FC = () => {
  const [Pageproduct, setPageproduct] = React.useState<number>(1);
  const [DelREf, setDelREf] = React.useState<string | null>(null);
  const [CatId, setCatId] = React.useState<string | null>(null);
  const [EditId, setEditId] = React.useState<string | null>(null);
  const [Addproduct, setAddproduct] = React.useState<boolean>(false);
  const [filteredSubcategories, setFilteredSubcategories] = React.useState<
    Isubcategories[]
  >([]);
  const [images, setImages] = React.useState<Array<string | ArrayBuffer>>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // فایل‌های انتخابی را دریافت می‌کنیم
    if (files) {
      const fileArray = Array.from(files); // تبدیل FileList به آرایه
      const readers = fileArray.map(file => {
        return new Promise<string | ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve(reader.result as string | ArrayBuffer);
          reader.onerror = reject;
          reader.readAsDataURL(file); // تبدیل فایل به Base64
        });
      });
      Promise.all(readers)
        .then(results => {
          setImages(prev => [...prev, ...results]); // افزودن تصاویر به آرایه
        })
        .catch(err => console.error('Error reading files', err));
    }
  };

  const EditSchema = z.object({
    name: z.string().min(1, 'نام محصول الزامی است'),
    description: z.string().min(1, 'توضیحات الزامی است'),
    images: z.any(),
    category: z.string(),
    subcategory: z.string(),
  });

  const AddSchema = z.object({
    name: z.string().min(1, 'نام محصول الزامی است'),
    price: z.string().min(1, 'قیمت محصول الزامی است'),
    quantity: z.string().min(1, 'تعداد محصول الزامی است'),
    brand: z.string().min(1, 'برند محصول الزامی است'),
    description: z.string().min(20, '.توضیحات باید بیشتر از 20 کارکتر باشد'),
    images: z.any(),
    subcategory: z.string(),
    category: z.string(),
  });

  type EditFormInputs = z.infer<typeof EditSchema>;

  const EditForm = useForm<EditFormInputs>({
    resolver: zodResolver(EditSchema),
  });

  type AddFormInputs = z.infer<typeof AddSchema>;

  const AddForm = useForm<AddFormInputs>({
    resolver: zodResolver(AddSchema),
  });

  const onSubmitEditForList: SubmitHandler<EditFormInputs> = async data => {
    console.log(data);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
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

  const onSubmitAddProduct: SubmitHandler<AddFormInputs> = async data => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('quantity', data.quantity);
    formData.append('brand', data.brand);
    formData.append('subcategory', data.subcategory);
    formData.append('category', data.category);
    formData.append('description', data.description);
    if (data.images && data.images[0]) {
      formData.append('images', data.images[0]);
    }
    try {
      await GetAddProduct(formData);

      setTimeout(() => {
        setAddproduct(!Addproduct);
      }, 200);
      toast.success('تغییرات ذخیره شد');
    } catch (error) {
      toast.error(`${error}`);
      console.error(error);
    }
  };

  const Allproduct = useQuery(
    ['Products', Pageproduct, EditId, Addproduct, DelREf],
    () => fetchAllproduct({ page: Pageproduct }),
    { keepPreviousData: true, staleTime: 5000 },
  );

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: fetchDelproduct,
    onSuccess: () => {
      // داده‌های کش را بعد از حذف محصول به‌روزرسانی کنید
      queryClient.invalidateQueries({ queryKey: ['Products'] });

      const products = queryClient.getQueryData<IProduct[]>([
        'products',
        Pageproduct,
      ]);
      if (Allproduct && Allproduct.data?.data.products.length === 1) {
        setPageproduct(prev => Math.max(prev - 1, 1)); // رفتن به صفحه قبلی
      }

      toast.success('محصول با موفقیت حذف شد');
      setDelREf(null);
    },
    onError: error => {
      toast.error('خطا در حذف محصول:', error as any);
    },
  });

  const totalpagesArrayForProduct = [];
  for (let i = 1; i <= Number(Allproduct.data?.total_pages); i++) {
    totalpagesArrayForProduct.push(i);
  }

  CategoriesAndSubcategoriesLoader();
  const categories = useSelector(
    (state: RootState) => state.categoriesAndSubcategories.categories,
  );
  const subcategories = useSelector(
    (state: RootState) => state.categoriesAndSubcategories.subcategories,
  );

  // به محض انتخاب دسته بندی جدید، زیر دسته ها را فیلتر می کنیم
  React.useEffect(() => {
    if (CatId) {
      const subcategoriesForSelectedCategory =
        subcategories?.data.subcategories.filter(
          subcategory => subcategory.category === CatId,
        );

      setFilteredSubcategories(subcategoriesForSelectedCategory || []);
    }
  }, [CatId, subcategories]);

  React.useEffect(() => {
    if (EditId && Allproduct) {
      const product = Allproduct.data?.data.products.find(
        p => p._id === EditId,
      );
      if (product) {
        EditForm.reset({
          name: product.name,
          description: product.description,
        });
      }
    }
  }, [EditId, Allproduct, EditForm]);

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
      <div className="p-4  flex flex-col gap-y-3">
        <section className="w-full max-w-[1000px] mx-auto bg-white rounded-md shadow-md  h-fit pt-2 px-4">
          <div className="flex justify-between py-2">
            <Button
              onClick={() => setAddproduct(!Addproduct)}
              text="افزودن کالا"
              classname={ClassNames(
                'border-green-300 text-xs text-white w-[110px] flex',
                ' justify-center h-7 font-semibold bg-teal-500 hover:bg-teal-400',
                'sm:w-28 sm:h-8 lg:w-36 sm:text-sm text-nowrap',
              )}
            />
            <p className="text-sm font-bold text-slate-700 sm:text-base">
              مدیریت کالا
            </p>
          </div>
          <table className="w-full max-w-[1000px] mx-auto border-collapse border border-gray-300 text-center">
            <thead className="bg-gray-100 text-gray-800">
              <tr className="border-b  border-gray-300">
                <th className="p-2 text-xs sm:text-sm font-medium">عملیات</th>
                <th className="p-2 text-xs sm:text-sm font-medium">
                  دسته بندی
                </th>
                <th className="p-2 text-xs sm:text-sm font-medium">
                  نام محصول
                </th>
                <th className="p-2 text-xs sm:text-sm font-medium">تصویر</th>
              </tr>
            </thead>

            <tbody>
              {Allproduct &&
                Allproduct.data?.data.products.map((p, index) => (
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
                          text="ویرایش"
                          onClick={() => setEditId(p._id)}
                        />
                        <Button
                          onClick={() => {
                            return setDelREf(p._id);
                          }}
                          classname="w-14 h-6 text-xs text-slate-700 sm:font-semibold sm:w-20 sm:h-8 border border-red-500 flex justify-center hover:bg-red-500 hover:text-white"
                          text="حذف"
                        />
                      </div>
                    </td>

                    <td className="p-1 px-2 text-xs sm:text-sm text-gray-700 font-medium">
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

                    <td className="p-1 px-3 text-xs sm:text-sm text-gray-800 font-semibold">
                      {p.name}
                    </td>
                    <td className="p-2">
                      <img
                        src={`http://localhost:8000/images/products/images/${p.images[0]}`}
                        alt={p.images[0]}
                        className="mx-auto rounded-md shadow-sm w-12"
                      />
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

        {DelREf && (
          <ModalForEdite>
            <p className="mb-4">آیا از حذف این آیتم مطمئن هستید؟</p>
            <div className="col-span-4 w-full gap-x-4 grid grid-cols-2 justify-items-center pt-2">
              <button
                onClick={() => deleteMutation.mutate(DelREf)}
                className=" border border-green-600 rounded-md text-xs sm:text-sm w-20 h-7 sm:w-36 flex justify-center items-center sm:h-10 bg-green-500 hover:bg-green-400 text-white font-semibold"
              >
                تائید
              </button>
              <button
                onClick={() => setDelREf(null)}
                className=" border border-red-600 rounded-md text-xs sm:text-sm w-20 h-7 sm:w-36 flex justify-center items-center sm:h-10 bg-red-500 hover:bg-red-400 text-white font-semibold"
              >
                بستن
              </button>
            </div>
          </ModalForEdite>
        )}
        {Addproduct && (
          <section>
            <ModalForEdite>
              <form
                onSubmit={AddForm.handleSubmit(onSubmitAddProduct)}
                className="w-full flex flex-col gap-2 "
              >
                <Input
                  name="name"
                  label=":نام محصول"
                  placeholder="Enter name"
                  register={AddForm.register}
                  required={true}
                  error={AddForm.formState.errors.name}
                />
                <Input
                  name="price"
                  label=":قیمت"
                  placeholder="Enter price"
                  register={AddForm.register}
                  required={true}
                  error={AddForm.formState.errors.price}
                />
                <Input
                  name="quantity"
                  label=":تعداد"
                  placeholder="Enter quantity"
                  register={AddForm.register}
                  required={true}
                  error={AddForm.formState.errors.quantity}
                />
                <Input
                  name="brand"
                  label=":نام تجاری"
                  placeholder="Enter brand"
                  register={AddForm.register}
                  required={true}
                  error={AddForm.formState.errors.brand}
                />
                <div className="flex flex-col gap-y-2 w-full">
                  <div className="w-full text-right  text-xs sm:text-sm space-y-2">
                    <label className="text-slate-700 font-semibold">
                      دسته بندی
                    </label>
                    <select
                      {...AddForm.register('category')}
                      onChange={e => setCatId(e.target.value)}
                      className="border max-h-[50px] overflow-y-auto relative z-10 font-semibold text-slate-700 border-slate-300  w-full max-w-[450px] rounded-md p-1 input text-right "
                    >
                      {categories?.data.categories.map(c => (
                        <option
                          key={c._id}
                          value={c._id}
                          className="font-semibold"
                        >
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {CatId !== null && (
                    <div className="w-full text-right  text-xs sm:text-sm space-y-2">
                      <label className="text-slate-700 font-semibold">
                        زیر دسته بندی
                      </label>
                      <select
                        {...AddForm.register('subcategory')}
                        className="border max-h-[50px] overflow-y-auto relative z-10 font-semibold text-slate-700 border-slate-300  w-full max-w-[450px] rounded-md p-1 input text-right "
                      >
                        {filteredSubcategories.map(s => (
                          <option
                            key={s._id}
                            value={s._id}
                            className="font-semibold px-2"
                          >
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    name="images"
                    label=":تصویر "
                    placeholder="Enter images"
                    register={AddForm.register}
                    required={false}
                    onChange={e => handleImageChange(e)}
                  />

                  {!!images.length && (
                    <div className=" flex gap-1 mt-2 p-2 w-full h-24 overflow-y-hidden overflow-x-scroll border-2 rounded-md ">
                      {images.map(
                        (imgs: string | ArrayBuffer, index: number) => (
                          <img
                            key={index}
                            src={imgs as string}
                            alt={`Selected ${index}`}
                            className="w-20 h-20 rounded-md"
                          />
                        ),
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full text-xs sm:text-base  flex flex-col gap-y-2 items-end   ">
                  <label
                    className="text-slate-700 font-semibold"
                    htmlFor="description"
                  >
                    :توضیحات
                  </label>

                  <TextEditor
                    name="description"
                    register={AddForm.register}
                    watch={AddForm.watch}
                    setValue={AddForm.setValue}
                    required={true}
                    error={AddForm.formState.errors.description}
                  />
                </div>

                <div className="col-span-4 w-full gap-x-4 grid grid-cols-2 justify-items-center pt-2">
                  <button
                    type="submit"
                    className=" border border-green-600 rounded-md text-xs sm:text-sm w-20 h-7 sm:w-36 flex justify-center items-center sm:h-10 bg-green-500 hover:bg-green-400 text-white font-semibold"
                  >
                    ذخیره
                  </button>
                  <button
                    onClick={() => setAddproduct(!Addproduct)}
                    type="submit"
                    className=" border border-red-600 rounded-md text-xs sm:text-sm w-20 h-7 sm:w-36 flex justify-center items-center sm:h-10 bg-red-500 hover:bg-red-400 text-white font-semibold"
                  >
                    بستن
                  </button>
                </div>
              </form>
            </ModalForEdite>
          </section>
        )}

        {EditId !== null && (
          <section>
            <ModalForEdite>
              <form
                onSubmit={EditForm.handleSubmit(onSubmitEditForList)}
                className="w-full max-w-[450px] flex flex-col gap-y-2 "
              >
                <Input
                  name="name"
                  label=":نام محصول"
                  placeholder="Enter name"
                  register={EditForm.register}
                  required={false}
                  error={EditForm.formState.errors.name}
                />
                <div className="flex flex-col gap-y-2 w-full">
                  <div className="w-full text-right text-xs sm:text-sm space-y-2">
                    <label className="text-slate-700 font-semibold">
                      دسته بندی
                    </label>
                    <select
                      {...EditForm.register('category')}
                      onChange={e => setCatId(e.target.value)}
                      className="border max-h-[50px] overflow-y-auto relative z-10 font-semibold text-slate-700 border-slate-300  w-full max-w-[450px] rounded-md p-1  text-right "
                    >
                      {categories?.data.categories.map(c => (
                        <option
                          key={c._id}
                          value={c._id}
                          className="font-semibold"
                        >
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {CatId !== null && (
                    <div className="w-full text-right  text-xs sm:text-sm space-y-2">
                      <label className="text-slate-700 font-semibold">
                        زیر دسته بندی
                      </label>
                      <select
                        {...EditForm.register('subcategory')}
                        className="border max-h-[50px] overflow-y-auto relative z-10 font-semibold text-slate-700 border-slate-300  w-full max-w-[450px] rounded-md p-1 input text-right "
                      >
                        {filteredSubcategories.map(s => (
                          <option
                            key={s._id}
                            value={s._id}
                            className="font-semibold px-2"
                          >
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    name="images"
                    label=":تصویر "
                    placeholder="Enter images"
                    register={EditForm.register}
                    required={false}
                    onChange={e => handleImageChange(e)}
                  />

                  {!!images.length && (
                    <div className=" flex gap-1 mt-2 p-2 w-full  h-24 overflow-y-hidden overflow-x-scroll border-2 rounded-md ">
                      {images.map(
                        (imgs: string | ArrayBuffer, index: number) => (
                          <img
                            key={index}
                            src={imgs as string}
                            alt={`Selected ${index}`}
                            className="w-20 h-20 rounded-md"
                          />
                        ),
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full text-xs sm:text-base  flex flex-col gap-y-2 items-end   ">
                  <label
                    className="text-slate-700 font-semibold"
                    htmlFor="description"
                  >
                    :توضیحات
                  </label>
                  <TextEditor
                    name="description"
                    register={EditForm.register} // ارسال register
                    setValue={EditForm.setValue}
                    watch={EditForm.watch}
                    required={true} // تعیین اینکه این فیلد اجباری است یا خیر
                    error={EditForm.formState.errors.description} // ارسال خطای مربوط به فیلد
                  />
                </div>

                <div className="col-span-4 w-full grid grid-cols-2 sm:gap-x-5 justify-items-center pt-2">
                  <button
                    type="submit"
                    className=" border border-green-600 rounded-md text-xs sm:text-sm w-20 h-7 sm:w-36 flex justify-center items-center sm:h-10 bg-green-500 hover:bg-green-400 text-white font-semibold"
                  >
                    ذخیره
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    type="submit"
                    className=" border border-red-600 rounded-md text-xs sm:text-sm w-20 h-7 sm:w-36 flex justify-center items-center sm:h-10 bg-red-500 hover:bg-red-400 text-white font-semibold"
                  >
                    بستن
                  </button>
                </div>
              </form>
            </ModalForEdite>
          </section>
        )}
      </div>
    </>
  );
};

export default ProductContainer;
