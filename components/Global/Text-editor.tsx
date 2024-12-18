import React, { useEffect, useRef } from 'react';
import {
  UseFormRegister,
  UseFormSetValue,
  FieldError,
  UseFormWatch,
} from 'react-hook-form';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface InputProps {
  name: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>; // برای مشاهده مقادیر فعلی فرم
  required?: boolean;
  error?: FieldError;
}

export const TextEditor = ({
  name,
  register,
  setValue,
  watch,
  required,
  error,
}: InputProps) => {
  const quillRef = useRef(null);
  const quillInstanceRef = useRef<Quill | null>(null); // استفاده از useRef برای نگهداری instance Quill

  // دریافت مقدار فعلی تکست ادیتور از فرم
  const editorContent = watch(name);

  useEffect(() => {
    if (quillRef.current && !quillInstanceRef.current) {
      // فقط زمانی که Quill هنوز initialize نشده است
      const quill = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            [{ align: [] }],
            ['clean'],
          ],
        },
      });

      quillInstanceRef.current = quill; // ذخیره instance Quill در quillInstanceRef

      // مقداردهی اولیه به Quill با محتوای موجود
      quill.root.innerHTML = editorContent || ''; // مقداردهی اولیه از watch

      // ارسال تغییرات به React Hook Form هنگام تغییر متن
      quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        setValue(name, content); // ارسال محتوای ویرایشگر به React Hook Form
      });
    }
  }, [name, setValue, editorContent]); // وقتی مقادیر فرم تغییر کرد، Quill هم بروزرسانی می‌شود

  return (
    <div className="w-full max-w-[450px] ">
      <div
        {...register(name, { required })}
        ref={quillRef}
        className="w-full border min-h-36"
      />
      {error && <p className="text-red-500 text-right">{error.message}</p>}
    </div>
  );
};
