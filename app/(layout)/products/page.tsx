'use client';

import Button from '@/components/Global/Button';
import { ClassNames } from '@/utils/classname-join';
import ProductCard from '@/components/Home/ProductCard';
import { fetchAllproduct } from '@/apis/AllProduct';
import React from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/Redux/store';
import { categoriesAndSubcategoriesActions } from '@/Redux/Features/CategorieAndSubcategorie';
import { useRouter } from 'next/navigation'; // استفاده از useRouter

const Products: React.FC = () => {
  const [Pageproduct, setPageproduct] = React.useState<number>(1);

  const router = useRouter(); // برای بروزرسانی URL
  const dispatch = useDispatch();
  const Categorie = useSelector(
    (state: RootState) => state.categoriesAndSubcategories,
  );
  const subCategorie = useSelector(
    (state: RootState) => state.categoriesAndSubcategories,
  );

  const Allproduct = useQuery(
    [
      'Products',
      Pageproduct,
      Categorie.categorieId,
      subCategorie.subcategorieId,
    ],
    () =>
      fetchAllproduct({
        page: Pageproduct,
        category: Categorie.categorieId,
        subcategory: subCategorie.subcategorieId,
      }),
    { keepPreviousData: true, staleTime: 5000 },
  );

  const totalpagesArrayForProduct = [];
  for (let i = 1; i <= Number(Allproduct?.data?.total_pages); i++) {
    totalpagesArrayForProduct.push(i);
  }
  const maxVisiblePages = 5;
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

  const updateURL = (page: number) => {
    const categoryParam = Categorie.categorieId
      ? `category=${Categorie.categories?.data.categories.find(c => c._id === Categorie.categorieId)?.name}`
      : '';
    const subcategoryParam = subCategorie.subcategorieId
      ? `subcategory=${subCategorie.subcategories?.data.subcategories.find(c => c._id === subCategorie.subcategorieId)?.name}`
      : '';
    const pageParam = `page=${page}`;

    // بروزرسانی URL با پارامترهای جدید
    router.push(`/products?${categoryParam}&${subcategoryParam}&${pageParam}`);
  };

  return (
    <>
      <section className="w-full p-3">
        {Categorie.categorieId && (
          <div className="flex flex-wrap gap-3 justify-center bg-gray-100 p-3 rounded-md mb-4">
            {subCategorie.subcategories?.data?.subcategories
              ?.filter(s => s.category === Categorie.categorieId)
              .map(subCategory => (
                <div
                  key={subCategory._id}
                  className={ClassNames(
                    'cursor-pointer bg-teal-500 text-white p-2 rounded-md shadow-md hover:bg-teal-600',
                    `${
                      subCategory._id === subCategorie.subcategorieId &&
                      'ring-2 ring-teal-700'
                    }`,
                  )}
                  onClick={() => {
                    dispatch(
                      categoriesAndSubcategoriesActions.setsubCategoriesForFilter(
                        subCategory._id,
                      ),
                    );
                    setPageproduct(1); // بازنشانی شماره صفحه به ۱
                    updateURL(1); // بروزرسانی URL هنگام تغییر ساب‌کتگوری
                  }}
                >
                  {subCategory.name}
                </div>
              ))}
          </div>
        )}

        <p className="p-4 text-xl font-semibold text-right text-slate-700">
          لیست محصولات
        </p>

        <div className="bg-white w-full h-fit rounded-md shadow-lg p-3">
          <div className="w-full h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-3">
            {Allproduct.isLoading &&
              [1, 2, 3, 4, 5, 6, 7, 8].map(e => (
                <main
                  key={e}
                  className="w-full max-w-72 h-96 border border-teal-300 p-3 rounded-md shadow-lg flex flex-col gap-y-3"
                >
                  <div className="w-full max-w-64 h-38 flex justify-center ">
                    <div className="rounded-md w-full max-w-72 h-36 max-h-36 bg-gray-300"></div>
                  </div>
                  <div className="flex flex-col gap-y-4 h-full justify-around items-center w-full max-w-72">
                    <div className="flex flex-col w-full gap-y-2">
                      <p className="font-semibold text-xs text-slate-600 line-clamp-3 bg-gray-400 animate-pulse w-full max-w-36 h-4 rounded-md "></p>
                      <p className="font-semibold text-xs text-slate-600 line-clamp-3 bg-gray-400 animate-pulse w-full max-w-28 h-4 rounded-md "></p>
                      <p className="font-semibold text-xs text-slate-600 line-clamp-3 bg-gray-400 animate-pulse w-full max-w-40 h-4 rounded-md "></p>
                    </div>
                    <div className="w-full flex justify-around items-center max-w-72">
                      <p className="text-teal-500 bg-gray-400 animate-pulse w-full max-w-28 h-7 rounded-md "></p>
                      <div className="text-white bg-gray-400 cursor-pointer animate-pulse rounded-full w-10 h-10 flex hover:bg-green-400 justify-center items-center"></div>
                    </div>
                  </div>
                </main>
              ))}
            {Allproduct.isSuccess &&
              Allproduct.data?.data.products.map((p, index) => (
                <div key={p._id} className="mx-auto">
                  <Link key={p._id} href={`./products/${p._id}`}>
                    <ProductCard
                      _id={p._id}
                      category={p.category}
                      subcategory={p.subcategory}
                      name={p.name}
                      price={p.price}
                      quantity={p.quantity}
                      brand={p.brand}
                      description={p.description}
                      thumbnail={p.thumbnail}
                      images={p.images}
                      slugname={p.slugname}
                    />
                  </Link>
                </div>
              ))}
          </div>

          {/* Pagination */}
          <section className="w-full mx-auto mt-5 max-w-[900px] flex flex-row justify-around">
            <Button
              classname="border-teal-500 text-xs text-slate-700 sm:text-sm font-semibold text-nowrap h-7 w-20 justify-center my-3"
              text="صفحه قبل"
              onClick={() => {
                if (Pageproduct > 1) {
                  setPageproduct(Pageproduct - 1);
                  updateURL(Pageproduct - 1); // بروزرسانی URL هنگام تغییر صفحه
                }
              }}
            />
            <div className="w-full max-w-[100px] flex flex-row gap-x-3 justify-center items-center cursor-pointer">
              {visiblePages.map(p => (
                <div
                  className={ClassNames(
                    `${
                      p === Pageproduct &&
                      'bg-teal-500 hidden sm:flex text-white px-3 pb-[2px] w-7 h-7 rounded-full justify-center items-center'
                    }`,
                  )}
                  key={p}
                  onClick={() => {
                    setPageproduct(p);
                    updateURL(p); // بروزرسانی URL هنگام تغییر صفحه
                  }}
                >
                  <p className="text-xs font-semibold text-slate-700 sm:text-sm hover:underline hidden sm:block">
                    {p}
                  </p>
                </div>
              ))}
              <p className="text-xs font-bold absolute text-slate-700 sm:hidden">
                {Pageproduct}
              </p>
            </div>
            <Button
              classname="border-teal-500 text-slate-700 text-xs sm:text-sm font-semibold text-nowrap h-7 w-20 justify-center my-3"
              text="صفحه بعد"
              onClick={() => {
                if (Pageproduct < totalpagesArrayForProduct.length) {
                  setPageproduct(Pageproduct + 1);
                  updateURL(Pageproduct + 1); // بروزرسانی URL هنگام تغییر صفحه
                }
              }}
            />
          </section>
        </div>
      </section>
    </>
  );
};

export default Products;
