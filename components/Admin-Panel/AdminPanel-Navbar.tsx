'use client';

import { getUserData } from '@/apis/UserData';
import Button from '../Global/Button';
import { MdAdminPanelSettings } from 'react-icons/md';
import { activityAdminPanelActions } from '@/Redux/Features/activitySliceAdminPanel';

import Link from 'next/link';
import React from 'react';
import { useAppDispatch } from '@/Redux/Hookuse';
import { ClassNames } from '@/utils/classname-join';

const AdminNavbar = () => {
  const [activity, setactivity] = React.useState<1 | 2 | 3>(1);
  const [information, setInformation] = React.useState<{
    name: string;
  } | null>(null);
  const dispatch = useAppDispatch(); // دسترسی به dispatch

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getUserData();
      setInformation({
        name: data?.data.user.firstname || '',
      });
    };

    fetchData();
  }, []);

  return (
    <main className="container mx-auto bg-slate-100 px-3 sm:px-5 py-2 border border-slate-500 shadow rounded-b-xl">
      <section className="flex flex-row justify-between px-3 items-center w-full ">
        <Link href={'/'}>
          <div className="gap-x-4 flex flex-row justify-center items-center ">
            <img
              src="./music-shop.png"
              alt="Meh store icon"
              className="w-12 lg:w-16"
            />
            <p className="text-3xl  font-bold font-mono text-slate-600 pt-2 hidden lg:block ">
              Meh Store
            </p>
          </div>
        </Link>
        <div className="flex flex-row w-full justify-around  max-w-[800px]">
          <p
            onClick={() => {
              return (
                dispatch(activityAdminPanelActions.setActivity('سفارشات')),
                setactivity(3)
              );
            }}
            className={ClassNames(
              `font-semibold hover:underline cursor-pointer text-xs sm:text-sm lg:text-base text-slate-700 pb-1 ${activity == 3 && ' border-b-2  border-teal-400 '}`,
            )}
          >
            سفارشات
          </p>
          <p
            onClick={() => {
              return (
                dispatch(
                  activityAdminPanelActions.setActivity('موجودی و قیمت ها'),
                ),
                setactivity(2)
              );
            }}
            className={ClassNames(
              `font-semibold hover:underline cursor-pointer text-xs sm:text-sm lg:text-base text-slate-700 pb-1 ${activity == 2 && ' border-b-2  border-teal-400 '}`,
            )}
          >
            موجودی و قیمت ها
          </p>
          <p
            onClick={() => {
              return (
                dispatch(activityAdminPanelActions.setActivity('کالاها')),
                setactivity(1)
              );
            }}
            className={ClassNames(
              `font-semibold hover:underline cursor-pointer text-xs sm:text-sm lg:text-base text-slate-700 pb-1 ${activity == 1 && ' border-b-2  border-teal-400 '}`,
            )}
          >
            کالاها
          </p>
        </div>
        <div className="w-full max-w-fit overflow-hidden hidden sm:block">
          <Button
            classnamefoText="marquee-text text-sm text-nowrap"
            text={information?.name as any}
            img={<MdAdminPanelSettings size={20} />}
            classname="text-sm font-semibold w-28 h-8 lg:w-36 lg:h-10 border-orange-500 text-orange-500"
            color="bg-orange-500"
          />
        </div>
      </section>
    </main>
  );
};

export default AdminNavbar;
