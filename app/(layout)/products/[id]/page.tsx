'use client';

import { fetchProductById } from '@/apis/GetProductById';
import { IProductById } from '@/types/Product';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Button from '@/components/Global/Button';

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState<IProductById | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const result: IProductById = await fetchProductById(id as string);
          console.log('Fetched Product:', result);
          setProduct(result);
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // در حال بارگذاری
  if (loading) {
    return <p>Loading...</p>;
  }

  // خطا یا داده نامعتبر
  if (!product || !product.data || !product.data.product) {
    return <p>Product not found</p>;
  }

  const selectedProduct = product.data.product;
  const imageSrc =
    selectedProduct.images && selectedProduct.images.length > 0
      ? `http://localhost:8000/images/products/images/${selectedProduct.images[0]}`
      : '/default-image.jpg';

  return (
    <main className="w-full p-4">
      <div className="bg-white rounded-md w-full max-w-[1200px] mx-auto p-3 ">
        <h1 className="text-2xl font-bold">{selectedProduct.name}</h1>
        <div className="container mx-auto p-4 grid grid-cols-2">
          <div className="">
            <img
              src={imageSrc}
              alt={selectedProduct.name}
              className="w-full max-w-md mx-auto"
            />
          </div>
          <p className="text-lg text-gray-700">{selectedProduct.description}</p>
          <p className="text-xl font-semibold text-teal-500">
            Price: {selectedProduct.price}
          </p>
          <Button
            classname="w-36 text-nowrap text-sm font-semibold bg-green-500 text-white flex items-center justify-center"
            text="افزودن به سبد خرید"
          />
        </div>
      </div>
    </main>
  );
}
