'use client';

import { FaCartShopping } from 'react-icons/fa6';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';
import React from 'react';
import { MdAdminPanelSettings } from 'react-icons/md';
import { IoLogOut } from 'react-icons/io5';
import Button from '@/components/Global/Button';
import { delSession, getSession } from '@/apis/Session-management';
import Hamburger from '@/components/Global/Hamburger';
import { getUserData } from '@/apis/UserData';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const [information, setInformation] = React.useState<{
    name: string;
    role: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        data &&
          setInformation({
            name: data?.data.user.firstname,
            role: data?.data.user.role,
          });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <main className="container mx-auto flex flex-col justify-center p-4">
      <section className="flex flex-row justify-between items-center w-full">
        <Link href={'./'}>
          <div className=" sm:gap-x-4 flex flex-row justify-center items-center ">
            <img
              src="./music-shop.png"
              alt="Meh store icon"
              className=" w-full max-w-10 sm:max-w-14"
            />
            <p className="text-2xl ml-2 sm:text-3xl  font-bold font-mono text-slate-600 pt-2">
              Meh Store
            </p>
          </div>
        </Link>
        <input
          type="text"
          placeholder="جستجو"
          className="placeholder:text-right hidden sm:block w-full max-w-[500px] mx-4 sm:mx-10 rounded-md border-2 px-2 pb-1 h-10 border-slate-300"
        />
        <div className="flex flex-row items-center justify-center gap-x-2">
          {getSession('UserId') && (
            <div className="flex flex-row gap-x-2">
              <Link href={'/'}>
                <div
                  className="w-10 h-10 hidden sm:flex items-center justify-center text-white bg-blue-400 rounded-md cursor-pointer hover:bg-blue-500"
                  title="LogOut"
                  onClick={() => {
                    delSession('UserId'), toast.success('خروج موفقیت آمیز');
                  }}
                >
                  <IoLogOut size={22} />
                </div>
                <div className="sm:hidden text-blue-500">
                  <IoLogOut size={25} title="LogOut" />
                </div>
              </Link>
              <div className="max-w-36 overflow-hidden">
                <Link
                  href={`${getSession('UserRole') === 'ADMIN' ? 'Admin-panel' : 'User-panel'}`}
                >
                  <div className="text-orange-500 sm:hidden ">
                    {information?.role === 'USER' ? (
                      <FaUser title="User panel" size={25} />
                    ) : (
                      <MdAdminPanelSettings title="Admin panel" size={25} />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <Button
                      classnamefoText="marquee-text text-sm text-nowrap"
                      text={information?.name as any}
                      img={
                        information?.role === 'USER' ? (
                          <FaUser title="User panel" />
                        ) : (
                          <MdAdminPanelSettings title="Admin panel" size={20} />
                        )
                      }
                      classname="text-sm font-semibold w-36  border-orange-500 text-orange-500"
                      color="bg-orange-500"
                    />
                  </div>
                </Link>
              </div>
              <Link href={'./orders'}>
                <div className="sm:hidden text-green-500 flex justify-center items-center cursor-pointer ">
                  <FaCartShopping size={21} title="سبد خرید" />
                </div>
              </Link>
            </div>
          )}
          {!getSession('UserId') && (
            <Link href={'/Login-Singup'}>
              <div className="text-orange-500 sm:hidden">
                <FaUser />
              </div>
              <div className="hidden sm:block">
                <Button
                  text="ورود کاربران"
                  img={<FaUser />}
                  classname="text-sm font-semibold w-36  border-orange-500 text-orange-500"
                  color="bg-orange-500"
                />
              </div>
            </Link>
          )}
          <div className="sm:hidden text-green-500">
            <FaCartShopping />
          </div>
          <div className="hidden sm:block" title="سبد خرید">
            <Link href={'./orders'}>
              <Button
                text="سبد خرید"
                img={<FaCartShopping />}
                number={0}
                classname=" font-semibold w-36  border-green-500 text-green-500"
                color="bg-green-500"
              />
            </Link>
          </div>
        </div>
      </section>
      <hr className="border border-slate-300 mt-3" />
      <section className=" flex flex-row pt-3 justify-between  w-full h-14 sm:hidden">
        <div className="flex items-center w-full">
          <input
            type="text"
            placeholder="جستجو"
            className="placeholder:text-right  block w-full mx-2 rounded-md border-2 px-2 pb-1 h-10 border-slate-300"
          />
        </div>

        <Link href={'./products'}>
          <Hamburger />
        </Link>
      </section>
      <section className=" sm:flex flex-row pt-3 hidden justify-between items-center w-full h-14">
        <div className="w-full max-w-32 flex  items-center flex-col ">
          <p className="text-teal-500 font-semibold"> 09033250600</p>
          <p className="bg-slate-300 rounded-md text-xs font-semibold py-1 px-2">
            از 10 صبح الی 19 عصر
          </p>
        </div>
        <div className="w-full max-w-[400px] flex justify-around ">
          <p className="hover:underline cursor-pointer hover:text-teal-600">
            درباره ما
          </p>
          <p className="hover:underline cursor-pointer hover:text-teal-600">
            تماس با ما
          </p>
          <p className="hover:underline cursor-pointer hover:text-teal-600">
            فروش اقساطی
          </p>
        </div>
        <div className="w-full max-w-fit h-10 ">
          <Hamburger />
        </div>
      </section>
    </main>
  );
};

export default Navbar;
