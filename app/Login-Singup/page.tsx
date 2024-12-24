'use client';

import { z } from 'zod';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Input from '@/components/Global/Input';
import { ClassNames } from '@/utils/classname-join';
import { getLoginReq } from '@/apis/Login';
import { getSingupReq } from '@/apis/Singup';
import Link from 'next/link';
import { delSession, getSession } from '@/apis/Session-management';
import { log } from 'console';

const loginSchema = z.object({
  username: z
    .string()
    .min(1, '.نام کاربردی را وارد کنید')
    .max(25, 'کلمه عبور بایدکمتر از 25 حرف باشد'),
  password: z.string(),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   '.رمز عبور باید حداقل 8 کاراکتر داشته باشد، شامل یک حرف بزرگ، یک حرف کوچک، یک عدد و یک کاراکتر خاص باشد',
  // ),
});

const SingupSchema = z.object({
  firstname: z.string().min(1, '.نام خود را وارد کنید'),
  lastname: z.string().min(1, 'نام خانوادگی خود را وارد کنید'),
  username: z
    .string()
    .min(1, '.نام کاربردی را وارد کنید')
    .max(25, 'کلمه عبور بایدکمتر از 25 حرف باشد'),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      '.رمز عبور باید حداقل 8 کاراکتر داشته باشد، شامل یک حرف بزرگ، یک حرف کوچک، یک عدد و یک کاراکتر خاص باشد',
    ),
  phoneNumber: z
    .string()
    .regex(/^09[0-9]{9}$/, '.شماره خود را به درستی وارد کنید'),
  address: z.string().min(1, '.آدرس را وارد کنید'),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;
export type SingupFormInputs = z.infer<typeof SingupSchema>;

export const logout = () => {
  console.log('asd');
  delSession('accessToken');

  const router = useRouter();
  router.push('/login');
};

const getLoginandSingup: React.FC = () => {
  const Router = useRouter();
  const loginForm = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const SingupForm = useForm<SingupFormInputs>({
    resolver: zodResolver(SingupSchema),
  });

  const onSubmitLog: SubmitHandler<LoginFormInputs> = async data => {
    const result = await getLoginReq(data);

    if (result) {
      if (result.data.user.role === 'ADMIN') {
        Router.push('/Admin-panel');
      } else {
        Router.push('/');
      }
    }
  };

  const onSubmitSing: SubmitHandler<SingupFormInputs> = data =>
    getSingupReq(data);
  const [LoginOrSingin, SetLoginOrSingin] = React.useState<1 | 2>(1);

  React.useEffect(() => {
    const timer = setInterval(() => {
      console.log('ssssssss');

      logout();
    }, 5000);

    return () => clearInterval(timer); // پاک کردن تایمر هنگام unmount
  }, []);

  return (
    <main className="container w-full  mx-auto bg-slate-200 px-2 pb-28">
      <div className="w-full p-3 gap-x-4 flex flex-row justify-center items-center ">
        <Link href={'./'}>
          <img src="./music-shop.png" alt="Meh store icon" className="w-16" />
        </Link>
        <Link href={'./'}>
          <p className="text-3xl font-bold font-mono text-slate-600">
            Meh Store
          </p>
        </Link>
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
          onSubmit={loginForm.handleSubmit(onSubmitLog)}
          className={ClassNames(
            'flex flex-col gap-y-5 pt-12',
            `${LoginOrSingin == 2 && 'hidden'}`,
          )}
        >
          <div className="flex flex-col gap-y-3 font-sans">
            <div className="w-full max-w-[450px] mx-auto flex flex-col gap-y-3 px-3">
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
            </div>
            <button
              type="submit"
              className=" text-white border-2 pt-1 pb-2 font-semibold mt-5 w-60 mx-auto rounded-md  bg-teal-500 hover:bg-teal-400"
            >
              ورود
            </button>
          </div>
        </form>

        <form
          onSubmit={SingupForm.handleSubmit(onSubmitSing)}
          className={ClassNames(
            'flex flex-col gap-y-5 pt-12',
            `${LoginOrSingin == 1 && 'hidden'}`,
          )}
        >
          <div className="flex flex-col gap-y-3 font-sans">
            <div className="w-full max-w-[450px] mx-auto flex flex-col gap-y-3 px-3">
              <Input
                name="firstname"
                label=":نام "
                placeholder="Enter your firstname"
                register={SingupForm.register}
                required={true}
                error={SingupForm.formState.errors.firstname}
              />
              <Input
                name="lastname"
                label=":نام خانوادگی"
                placeholder="Enter your lastname"
                register={SingupForm.register}
                required={true}
                error={SingupForm.formState.errors.lastname}
              />
              <Input
                name="username"
                label=":نام کاربری"
                placeholder="Enter your username"
                register={SingupForm.register}
                required={true}
                error={SingupForm.formState.errors.username}
              />
              <Input
                name="password"
                label=":رمز عبور"
                placeholder="Enter your Passwors"
                register={SingupForm.register}
                required={true}
                error={SingupForm.formState.errors.password}
              />
              <Input
                name="phoneNumber"
                label=":شماره تماس"
                placeholder="Enter your phoneNumber"
                register={SingupForm.register}
                required={true}
                error={SingupForm.formState.errors.phoneNumber}
              />
              <Input
                name="address"
                label=":نشانی"
                placeholder="Enter your address"
                register={SingupForm.register}
                required={true}
                error={SingupForm.formState.errors.address}
              />
            </div>
            <button
              type="submit"
              className=" text-white border-2 pt-1 pb-2 font-semibold mt-5 w-60 mx-auto rounded-md  bg-teal-400 hover:bg-teal-400"
            >
              ثبت نام
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
export default getLoginandSingup;
