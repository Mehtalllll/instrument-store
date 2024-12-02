'use client';

import Hamburger from 'hamburger-react';
import { RiArrowDownSFill } from 'react-icons/ri';
import React from 'react';
import { ClassNames } from '@/utils/classname-join';

export default function HamburgerMenu() {
  const [isOpen, setisOpen] = React.useState<boolean>(false);
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
        <div className="bg-teal-400 w-full rounded-b-md">
          <p>گیتار</p>
          <p>پیانو</p>
          <p>سه تار</p>
        </div>
      )}
    </main>
  );
}
