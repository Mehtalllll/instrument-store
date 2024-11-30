import { ClassNames } from '@/utils/classname-join';

export default function notFound() {
  return (
    <div className="text-slate-800 bg-white w-full h-screen flex flex-row">
      <div
        className={ClassNames(
          'flex flex-col justify-center items-center w-full',
          ' bg-black bg-opacity-90  border-r border-slate-700',
          ' space-y-2',
        )}
      >
        <p className="text-7xl font-extrabold text-slate-300">404</p>
        <p className=" text-3xl font-semibold text-slate-300 ">Not Found</p>
        <p className="pt-3 pb-10 text-sm font-extralight text-slate-100 ">
          Sorry, the page you're looking for doesn't exist
        </p>
        <button
          className={ClassNames(
            'border border-slate-600 rounded-md w-40 h-10 text-sm font-light text-slate-100',
            ' hover:text-slate-400 shadow-button',
          )}
        >
          {'<<'} Go back to Home
        </button>
      </div>
      <img src="./404.png" className="w-fit h-screen" alt="" />
    </div>
  );
}
