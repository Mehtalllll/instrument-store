'use client';
import { RootState } from '@/Redux/store';
import { useSelector } from 'react-redux';

const OrdersForUser: React.FC = () => {
  const orders = useSelector((state: RootState) => state.AddToCart.cart);

  // اطمینان از اینکه داده‌ها صحیح هستند
  console.log('Orders in cart:', orders);

  return (
    <main>
      {orders && orders.length > 0 ? (
        orders.map(o => (
          <p key={o._id} className="bg-green-400 w-full h-3">
            {o.name}
          </p>
        ))
      ) : (
        <p>No orders in the cart</p> // در صورتی که سبد خرید خالی باشد
      )}
    </main>
  );
};

export default OrdersForUser;
