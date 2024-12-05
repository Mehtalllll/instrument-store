'use client';

import { Provider } from 'react-redux';
import Mystore from '@/Redux/store';

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={Mystore}>{children}</Provider>;
};

export default ReduxProvider;
