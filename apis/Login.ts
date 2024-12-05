import toast from 'react-hot-toast';

import { ILoginDto } from '@/types/Login';
import { setSession } from './Session-management';
import { LoginFormInputs } from '@/app/Login-Singup/page';

export const getLoginReq = async (data: LoginFormInputs) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ILoginDto = await response.json();

    if (response.ok) {
      console.log('Login successful:', result);
      toast.success('ورود موفقیت آمیز');

      setSession('accessToken', result.token.accessToken);
      setSession('refreshToken', result.token.refreshToken);
      setSession('UserRole', result.data.user.role);
      setSession('UserId', result.data.user._id);
      return result;
    } else {
      console.error('Login failed:', result);
      alert(result.message || 'مشکلی پیش آمده است');
    }
  } catch (error) {
    console.log('Error:', error);
    toast.error('.نام کاربری یا رمز وارد شده صحیح نمی باشد');
  }
};
