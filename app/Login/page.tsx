'use client';
import Input from '@/components/Input';
import { ClassNames } from '@/utils/classname-join';
import { log } from 'console';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  username: string;
  password: string;
};

const getLogin: React.FC = () => {
  const loginForm = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);
  const [LoginOrSingin, SetLoginOrSingin] = React.useState<1 | 2>(1);
  return (
    <main className="container w-full  mx-auto bg-slate-200 px-2 pb-28">
      <div className="w-full p-3 gap-x-4 flex flex-row justify-center items-center ">
        <img src="./music-shop.png" alt="Meh store icon" className="w-16" />
        <p className="text-3xl font-bold font-mono text-slate-600">Meh Store</p>
      </div>
      <hr className="border border-slate-300"></hr>
      <section className="bg-white w-full max-w-[500px] h-fit pb-10 border-2 border-slate-300 mx-auto mt-10 rounded-lg">
        <div className="font-sans grid grid-cols-2 text-center ">
          <p
            onClick={() => SetLoginOrSingin(2)}
            className={ClassNames(
              'py-4 text-xl font-bold text-slate-500 border-b-2 cursor-pointer hover:text-black',
              `${LoginOrSingin == 2 && ' border-b-teal-400 border-b-4'}`,
            )}
          >
            ثبت نام
          </p>
          <p
            onClick={() => SetLoginOrSingin(1)}
            className={ClassNames(
              'py-4 text-xl font-bold text-slate-500 border-b-2 cursor-pointer hover:text-black ',
              `${LoginOrSingin == 1 && ' border-b-teal-400 border-b-4'}`,
            )}
          >
            ورود به سایت
          </p>
        </div>
        <form
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className={ClassNames(
            'flex flex-col gap-y-5 pt-12',
            `${LoginOrSingin == 2 && 'hidden'}`,
          )}
        >
          <div className="flex flex-col gap-y-3 font-sans">
            <Input
              name="username"
              label=":نام کاربری"
              placeholder="Enter your username"
              register={loginForm.register}
              required={true}
              error={loginForm.formState.errors.username}
            />
            <Input
              name="password"
              label=":رمز عبور"
              placeholder="Enter your Passwors"
              register={loginForm.register}
              required={true}
              error={loginForm.formState.errors.password}
            />
            <button
              type="submit"
              className=" text-white border-2 pt-1 pb-2 font-semibold mt-5 w-60 mx-auto rounded-md  bg-teal-500 hover:bg-teal-400"
            >
              ورود
            </button>
          </div>
        </form>

        <form
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className={ClassNames(
            'flex flex-col gap-y-5 pt-12',
            `${LoginOrSingin == 1 && 'hidden'}`,
          )}
        >
          <div className="flex flex-col gap-y-3 font-sans">
            <Input
              name="firstname"
              label=":نام "
              placeholder="Enter your firstname"
              register={loginForm.register}
              required={true}
              error={loginForm.formState.errors.username}
            />
            <Input
              name="lastname"
              label=":نام خانوادگی"
              placeholder="Enter your lastname"
              register={loginForm.register}
              required={true}
              error={loginForm.formState.errors.username}
            />
            <Input
              name="username"
              label=":نام کاربری"
              placeholder="Enter your username"
              register={loginForm.register}
              required={true}
              error={loginForm.formState.errors.username}
            />
            <Input
              name="password"
              label=":رمز عبور"
              placeholder="Enter your Passwors"
              register={loginForm.register}
              required={true}
              error={loginForm.formState.errors.password}
            />
            <Input
              name="phoneNumber"
              label=":شماره تماس"
              placeholder="Enter your phoneNumber"
              register={loginForm.register}
              required={true}
              error={loginForm.formState.errors.username}
            />
            <Input
              name="address"
              label=":نشانی"
              placeholder="Enter your address"
              register={loginForm.register}
              required={true}
              error={loginForm.formState.errors.username}
            />
            <Input
              name="firstname"
              label=":نام کاربری"
              placeholder="Enter your username"
              register={loginForm.register}
              required={true}
              error={loginForm.formState.errors.username}
            />
            <button
              type="submit"
              className=" text-white border-2 pt-1 pb-2 font-semibold mt-5 w-60 mx-auto rounded-md  bg-teal-400 hover:bg-teal-400"
            >
              ورود
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
export default getLogin;
