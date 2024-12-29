'use client';
import { fetchAllOrders } from '@/apis/AllOrders';
import { fetchAllproduct } from '@/apis/AllProduct';
import { getAllUserData } from '@/apis/AllUserData';
import OrderForAdmin from '@/components/Admin-Panel/Order';
import PriceAndQuantity from '@/components/Admin-Panel/PriceAndQuantity';
import ProductContainer from '@/components/Admin-Panel/product';

import { RootState } from '@/Redux/store';
import { IResUserlist } from '@/types/Alluser';
import { IResOrders } from '@/types/Orders';
import { IProductsList } from '@/types/Product';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { useAuth } from '@/Provider/AuthProvider';
import AdminGuard from '@/components/Admin-Panel/AdminGard';

const EditSchema = z.object({
  name: z.string().min(1, 'نام محصول الزامی است'),
  price: z.string().regex(/^\d+$/, 'قیمت باید عدد باشد'),
  quantity: z.string().regex(/^\d+$/, 'تعداد باید عدد باشد'),
  brand: z.string().min(1, 'نام تجاری الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  thumbnail: z.string(),
  images: z.any(), // قبول فایل
  subcategory: z.string(),
});

type EditFormInputs = z.infer<typeof EditSchema>;

const AdminPanel: React.FC = () => {
  const [Allproduct, setAllproduct] = React.useState<IProductsList>();
  const [AllOrders, setAllOrders] = React.useState<IResOrders>();
  const [Pageproduct, setPageproduct] = React.useState<number>(1);
  const [PageOrders, setPageOrders] = React.useState<number>(1);
  const [information, setInformation] = React.useState<IResUserlist>();
  const [filters, setFilters] = React.useState({
    name: ' ', // فیلتر نام محصول
  });
  const [EditePriceAndQuantity, setEditePriceAndQuantity] = React.useState<
    string | null
  >(null);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  const filteredData = React.useMemo(() => {
    if (!Allproduct) return [];
    return Allproduct.data.products.filter(product => {
      const matchesName =
        filters.name &&
        product.name.toLowerCase().includes(filters.name.toLowerCase());

      return matchesName;
    });
  }, [Allproduct, filters]);

  const activity = useSelector((state: RootState) => state.activity);

  const totalpagesArrayForProduct = [];
  for (let i = 1; i <= Number(Allproduct?.total_pages); i++) {
    totalpagesArrayForProduct.push(i);
  }
  const totalpagesArrayFororders = [];
  for (let i = 1; i <= Number(AllOrders?.total_pages); i++) {
    totalpagesArrayFororders.push(i);
  }
  const { logout } = useAuth();
  React.useEffect(() => {
    console.log('Setting up timer...');
    const timer = setInterval(
      () => {
        console.log('Calling logout...');
        logout();
      },
      15 * 60 * 1000,
    );

    return () => {
      console.log('Cleaning up timer...');
      clearInterval(timer);
    };
  }, []);

  const EditForm = useForm<EditFormInputs>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      name: '',
      price: '',
      quantity: '',
      brand: '',
      description: '',
      thumbnail: '',
      subcategory: '',
    },
  });

  React.useEffect(() => {
    const loadAllproduct = async (Pageproduct: number) => {
      const result: IProductsList = await fetchAllproduct({
        page: Pageproduct,
      });
      setAllproduct(result);
    };

    loadAllproduct(Pageproduct);
  }, [Pageproduct]);

  React.useEffect(() => {
    const loadAllOrders = async (PageOrders: number) => {
      const resultorders: IResOrders = await fetchAllOrders(PageOrders);
      setAllOrders(resultorders);
    };
    loadAllOrders(PageOrders);
  }, [PageOrders]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data: IResUserlist = await getAllUserData();
      setInformation(data);
    };

    fetchData();
  }, [PageOrders]);

  const onSubmitEditForPrice: SubmitHandler<EditFormInputs> = async data => {
    console.log('Form Data:', data);
    const formData = new FormData();
    formData.append('price', data.price);
    formData.append('quantity', data.quantity);
    console.log(formData);
    // GetEditeProduct(formData, EditePriceAndQuantity);
  };

  console.log(information);

  return (
    <AdminGuard>
      <main className="container mx-auto ">
        {activity === 'کالاها' && <ProductContainer />}
        {activity === 'موجودی و قیمت ها' && <PriceAndQuantity />}
        {activity === 'سفارشات' && <OrderForAdmin />}
      </main>
    </AdminGuard>
  );
};

export default AdminPanel;
