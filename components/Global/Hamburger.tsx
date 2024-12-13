'use client';

import Hamburger from 'hamburger-react';
import { RiArrowDownSFill } from 'react-icons/ri';
import React from 'react';
import { ClassNames } from '@/utils/classname-join';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import CategoriesAndSubcategoriesLoader, {
  categoriesAndSubcategoriesActions,
} from '@/Redux/Features/CategorieAndSubcategorie';
import { useAppDispatch } from '@/Redux/Hookuse';
import Link from 'next/link';

export default function HamburgerMenu() {
  const [isOpen, setisOpen] = React.useState<boolean>(false);
  const [isOpensub, setisOpensub] = React.useState<string | null>(null);

  const dispatch = useAppDispatch();

  CategoriesAndSubcategoriesLoader();
  const categories = useSelector(
    (state: RootState) => state.categoriesAndSubcategories.categories,
  );
  const subcategories = useSelector(
    (state: RootState) => state.categoriesAndSubcategories.subcategories,
  );

  return (
    <main className="w-fit  flex flex-col">
      <section
        className="hidden sm:block relative right-0"
        onMouseEnter={() => setisOpen(true)}
        onMouseLeave={() => {
          setisOpen(false), setisOpensub(null);
        }}
      >
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
          <div className="bg-teal-400 w-full rounded-b-md pb-2 absolute z-50">
            {categories &&
              categories.data.categories.map((cat, index) => {
                return (
                  <>
                    <p
                      key={index}
                      onClick={() =>
                        setisOpensub(isOpensub === cat._id ? null : cat._id)
                      }
                      className="text-right hover:rounded-md   hover:bg-teal-300 w-full cursor-pointer "
                    >
                      <p
                        className="px-2 py-1 text-slate-700 font-bold relative"
                        key={index}
                        onMouseEnter={() => setisOpensub(cat._id)}
                        onClick={() =>
                          dispatch(
                            categoriesAndSubcategoriesActions.setCategoriesForFilter(
                              cat._id,
                            ),
                            dispatch(
                              categoriesAndSubcategoriesActions.setsubCategoriesForFilter(
                                '',
                              ),
                            ),
                          )
                        }
                      >
                        {cat.name}
                      </p>
                      {isOpensub === cat._id && (
                        <div className="bg-teal-300 w-full min-h-full max-h-fit absolute right-[189px] top-0 rounded-md">
                          {subcategories &&
                            subcategories.data.subcategories
                              .filter(sub => sub.category === cat._id)
                              .map((sub, index) => (
                                <p
                                  key={index}
                                  className="text-right hover:rounded-md  hover:bg-teal-400 w-full cursor-pointer"
                                  onClick={() =>
                                    dispatch(
                                      categoriesAndSubcategoriesActions.setsubCategoriesForFilter(
                                        sub._id,
                                      ),
                                    )
                                  }
                                >
                                  <Link href={'./products'}>
                                    {' '}
                                    <p className="px-2 py-1 text-slate-700 ">
                                      {sub.name}
                                    </p>
                                  </Link>
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
      </section>
      <div className="w-fit sm:hidden ">
        <Hamburger
          size={28}
          toggle={setisOpen}
          toggled={isOpen}
          color="black"
        />
      </div>
      <section className="sm:hidden">
        {isOpen && (
          <div className="bg-teal-300 p-3 rounded-md absolute left-0 w-screen z-50">
            {categories &&
              categories.data.categories.map((cat, index) => {
                return (
                  <>
                    <p
                      key={index}
                      onClick={() =>
                        setisOpensub(isOpensub == cat._id ? null : cat._id)
                      }
                      className="text-right hover:rounded-md  hover:bg-teal-400 w-full cursor-pointer "
                    >
                      <p
                        key={cat._id}
                        className="px-3 py-2 font-bold text-slate-700 text-base"
                        onClick={() =>
                          dispatch(
                            categoriesAndSubcategoriesActions.setCategoriesForFilter(
                              cat._id,
                            ),
                            dispatch(
                              categoriesAndSubcategoriesActions.setsubCategoriesForFilter(
                                '',
                              ),
                            ),
                          )
                        }
                      >
                        {cat.name}
                      </p>
                      {isOpensub === cat._id && (
                        <div className="bg-teal-300 w-full ">
                          {subcategories &&
                            subcategories.data.subcategories
                              .filter(sub => sub.category === cat._id)
                              .map((sub, index) => (
                                <p
                                  key={index}
                                  className="text-right px-2   hover:bg-teal-400 w-full cursor-pointer"
                                >
                                  <p
                                    key={sub._id}
                                    className="px-3 py-2 text-slate-700 "
                                    onClick={() =>
                                      dispatch(
                                        categoriesAndSubcategoriesActions.setsubCategoriesForFilter(
                                          sub._id,
                                        ),
                                      )
                                    }
                                  >
                                    {sub.name}
                                  </p>
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
      </section>
    </main>
  );
}
