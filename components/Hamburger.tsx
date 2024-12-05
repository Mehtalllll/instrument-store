'use client';

import Hamburger from 'hamburger-react';
import { RiArrowDownSFill } from 'react-icons/ri';
import React from 'react';
import { ClassNames } from '@/utils/classname-join';
import { fetchCategories } from '@/apis/categories';
import { IRescategories } from '@/types/categories';
import { IRessubcategories } from '@/types/subcategories';
import { fetchSubCategories } from '@/apis/subcategories';

export default function HamburgerMenu() {
  const [isOpen, setisOpen] = React.useState<boolean>(false);
  const [isOpensub, setisOpensub] = React.useState<boolean>(false);
  const [categories, setcategories] = React.useState<IRescategories>();
  const [subcategories, setsubcategories] = React.useState<IRessubcategories>();

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
  console.log(subcategories);

  return (
    <main className=" w-fit flex flex-col">
      <div
        onClick={() => setisOpen(!isOpen)}
        className={ClassNames(
          ' bg-teal-400 w-full rounded-md max-w-[265px] cursor-pointer',
          ' flex flex-col justify-between items-stretch hover:bg-emerald-300 h-fit',
          `${!!isOpen && 'rounded-b-none'}`,
        )}
      >
        <div className="flex flex-row items-center justify-between">
          <RiArrowDownSFill className="w-7 h-7 text-slate-700 hover:text-black" />
          <div>
            <p className="text-slate-700 font-semibold ">تمامی محصولات</p>
            <p className="text-[11px] font-bold text-slate-700 ">
              All Departments
            </p>
          </div>
          <Hamburger
            size={28}
            toggle={setisOpen}
            toggled={isOpen}
            color="white"
          />
        </div>
      </div>
      {isOpen && (
        <div className="bg-teal-400 w-full rounded-b-md pb-2">
          {categories &&
            categories.data.categories.map((cat, index) => {
              return (
                <>
                  <p
                    key={index}
                    onClick={() => setisOpensub(!isOpensub)}
                    className="text-right px-2 hover:bg-teal-300 w-full cursor-pointer py-1"
                  >
                    {cat.name}
                    {isOpensub && (
                      <div className="bg-teal-400 w-full py-1">
                        {subcategories &&
                          subcategories.data.subcategories.map((sub, index) => (
                            <p
                              key={index}
                              className="text-right px-2 hover:bg-teal-300 w-full cursor-pointer"
                            >
                              {cat._id == sub.category && sub.name}
                            </p>
                          ))}
                      </div>
                    )}
                  </p>
                </>
              );
            })}
        </div>
      )}
    </main>
  );
}
