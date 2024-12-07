'use client';

import { getUserData } from '@/apis/UserData';
import Button from '../Button';
import { MdAdminPanelSettings } from 'react-icons/md';
import { activityAdminPanelActions } from '@/Redux/Features/activitySliceAdminPanel';

import Link from 'next/link';
import React from 'react';
import { useAppDispatch } from '@/Redux/Hookuse';

const AdminNavbar = () => {
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
    <main className="container mx-auto bg-slate-300 px-3 py-2">
      <section className="flex flex-row justify-between items-center w-full">
        <Link href={'/'}>
          <div className="gap-x-4 flex flex-row justify-center items-center ">
            <img src="./music-shop.png" alt="Meh store icon" className="w-14" />
            <p className="text-3xl font-bold font-mono text-slate-600 pt-2">
              Meh Store
            </p>
          </div>
        </Link>
        <p
          onClick={() =>
            dispatch(activityAdminPanelActions.setActivity('سفارشات'))
          }
          className="font-semibold hover:underline cursor-pointer"
        >
          سفارشات
        </p>
        <p
          onClick={() =>
            dispatch(activityAdminPanelActions.setActivity('موجودی و قیمت ها'))
          }
          className="font-semibold hover:underline cursor-pointer"
        >
          موجودی و قیمت ها
        </p>
        <p
          onClick={() =>
            dispatch(activityAdminPanelActions.setActivity('کالاها'))
          }
          className="font-semibold hover:underline cursor-pointer"
        >
          کالاها
        </p>
        <div className="w-36 overflow-hidden">
          <Button
            classnamefoText="marquee-text text-sm text-nowrap"
            text={information?.name as any}
            img={<MdAdminPanelSettings size={20} />}
            classname="text-sm font-semibold w-36 border-orange-500 text-orange-500"
            color="bg-orange-500"
          />
        </div>
      </section>
    </main>
  );
};

export default AdminNavbar;
