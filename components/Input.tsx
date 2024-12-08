import React from 'react';

import { FieldError, UseFormRegister } from 'react-hook-form';

interface InputProps {
  name: string; // نام فیلد
  label?: string; // برچسب نمایش داده شده
  type?: 'text' | 'email' | 'password' | 'number' | 'file'; // نوع ورودی
  placeholder?: string; // متن راهنما
  register: UseFormRegister<any>; // RHF register function
  required?: boolean; // آیا فیلد اجباری است
  error?: FieldError; // خطاهای مرتبط با این فیلد
  accept?: string | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
const Input: React.FC<InputProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  required,
  error,
  accept,
  onChange,
}) => {
  return (
    <div className="input-wrapper text-xs sm:text-base text-slate-800 px-6 gap-y-2 flex flex-col">
      <label className="font-medium text-right text-slate-600" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        accept={accept}
        placeholder={placeholder}
        {...register(name, { required })}
        onChange={onChange}
        className={`border border-slate-300  w-full max-w-[450px] rounded-md p-1 input ${error ? 'input-error' : ''}`}
      />
      {error && (
        <p className="text-xs font-semibold text-red-400 pr-1 text-right">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;
