import { SingupFormInputs } from '@/app/Login-Singup/page';
import toast from 'react-hot-toast';

export const getSingupReq = async (data: SingupFormInputs) => {
  try {
    console.log(data);
    const response = await fetch('http://localhost:8000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Singup successful:', result);
      toast.success('Singup successful');
      // هدایت کاربر یا ذخیره توکن
    } else {
      console.error('Login failed:', result);
      alert(result.message || 'مشکلی پیش آمده است');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('مشکلی در برقراری ارتباط وجود دارد');
  }
};
