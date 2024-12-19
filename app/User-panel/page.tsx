import Button from '@/components/Global/Button';
import { FaCartShopping } from 'react-icons/fa6';

const UserPanel: React.FC = () => {
  return (
    <>
      <Button
        text="سبد خرید"
        img={<FaCartShopping />}
        number={0}
        classname=" font-semibold  border-green-500 text-green-500"
        color="bg-green-500"
      />
    </>
  );
};

export default UserPanel;
