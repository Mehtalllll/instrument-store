import { useQuery } from 'react-query';
import { fetchProductById } from '@/apis/GetProductById';

const ProductName = ({ productId }: { productId: string }) => {
  const { data, isLoading, error } = useQuery(
    ['product', productId],
    () => fetchProductById(productId),
    { staleTime: 5000 },
  );

  if (isLoading)
    return <p className="text-gray-500 text-sm">در حال بارگذاری...</p>;
  if (error) return <p className="text-red-500 text-sm">خطا در دریافت محصول</p>;

  return (
    <p className="text-sm font-semibold text-slate-700">
      {data?.data.product.name || 'نامشخص'}
    </p>
  );
};

export default ProductName;
