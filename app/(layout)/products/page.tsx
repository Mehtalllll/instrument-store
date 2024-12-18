'use client';
import { fetchAllproduct } from '@/apis/AllProduct';
import Button from '@/components/Global/Button';
import Navbar from '@/components/Global/Navbar';
import ProductCard from '@/components/Home/ProductCard';
import { RootState } from '@/Redux/store';
import { IProductsList } from '@/types/Product';
import { ClassNames } from '@/utils/classname-join';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const Products: React.FC = () => {
  const [Allproduct, setAllproduct] = React.useState<IProductsList>();
  const [Pageproduct, setPageproduct] = React.useState<number>(1);

  const CategorieId = useSelector(
    (state: RootState) => state.categoriesAndSubcategories.categorieId,
  );
  const subCategorieId = useSelector(
    (state: RootState) => state.categoriesAndSubcategories.subcategorieId,
  );
  const totalpagesArrayForProduct = [];
  for (let i = 1; i <= Number(Allproduct?.total_pages); i++) {
    totalpagesArrayForProduct.push(i);
  }

  React.useEffect(() => {
    const loadAllproduct = async (Pageproduct: number) => {
      const result: IProductsList = await fetchAllproduct({
        page: Pageproduct,
        category: CategorieId,
        subcategory: subCategorieId,
      });
      setAllproduct(result);
    };

    loadAllproduct(Pageproduct);
  }, [Pageproduct, CategorieId, subCategorieId]);

  console.log(Allproduct);

  return (
    <>
      <section className="w-full p-3 ">
        <p className="p-4 text-xl font-semibold text-right text-slate-700">
          لیست محصولات
        </p>
        <div className="bg-white w-full h-fit rounded-md shadow-lg p-3 ">
          <div className=" w-full h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-3">
            {Allproduct &&
              Allproduct.data.products.map((p, index) => (
                <div key={p._id} className=" mx-auto">
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
          <section className="w-full mx-auto pt-5 max-w-[900px] flex flex-row justify-around">
            <Button
              classname="border-teal-500 text-xs text-slate-700 sm:text-sm font-semibold text-nowrap h-7 w-20 justify-center my-3"
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
        </div>
      </section>
    </>
  );
};
export default Products;
