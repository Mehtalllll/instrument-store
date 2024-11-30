import Button from '@/components/Button';
import { FaCartShopping } from 'react-icons/fa6';
import { FaUser } from 'react-icons/fa';
import Hamburger from '@/components/Hamburger';

export default function Home() {
  return (
    <main className="container mx-auto flex flex-col justify-center p-4">
      <section className="flex flex-row justify-between items-center w-full">
        <div className=" gap-x-4 flex flex-row justify-center items-center ">
          <img src="./music-shop.png" alt="Meh store icon" className="w-14" />
          <p className="text-3xl font-bold font-mono text-slate-600 pt-2">
            Meh Store
          </p>
        </div>
        <input
          type="text"
          placeholder="جستجو"
          className="placeholder:text-right w-[500px] mx-10 rounded-md border-2 px-2 pb-1 h-10 border-slate-300"
        />
        <div className="flex flex-row gap-x-2">
          <Button text="سبد خرید" img={<FaUser />} />
          <Button text="سبد خرید" img={<FaCartShopping />} number={0} />
        </div>
      </section>
      <hr className="border border-slate-300 mt-3" />
      <section className="flex flex-row pt-3  justify-between items-center w-full h-14">
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
            فروش اقساطی{' '}
          </p>
        </div>
        <div className="w-full max-w-fit h-10 ">
          <Hamburger />
        </div>
      </section>
    </main>
  );
}
