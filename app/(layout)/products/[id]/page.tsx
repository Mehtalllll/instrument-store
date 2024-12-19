'use client';

import { fetchProductById } from '@/apis/GetProductById';
import { IProductById } from '@/types/Product';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Button from '@/components/Global/Button';
import { IProductCard } from '@/components/Home/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { AddToCartActions } from '@/Redux/Features/AddToCart';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';
import { RootState } from '@/Redux/store';

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState<IProductById | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const quantityinp = useSelector((State: RootState) => State.AddToCart.cart);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product || !product.data || !product.data.product) {
    return <p>Product not found</p>;
  }

  const selectedProduct = product.data.product;

  const handleAddToCart = () => {
    const product: IProductCard = {
      _id: selectedProduct._id,
      category: selectedProduct.category.name,
      subcategory: selectedProduct.subcategory.name,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: selectedProduct.quantity,
      brand: selectedProduct.brand,
      description: selectedProduct.description,
      thumbnail: selectedProduct.thumbnail,
      images: selectedProduct.images,
      slugname: selectedProduct.slugname,
    };
    dispatch(AddToCartActions.addProductToCart(product));
  };
  const imageSrc =
    selectedProduct.images && selectedProduct.images.length > 0
      ? `http://localhost:8000/images/products/images/${selectedProduct.images[0]}`
      : '/default-image.jpg';

  return (
    <main className="w-full p-4">
      <div className="bg-white rounded-md w-full max-w-[1200px] max-h-[500px] mx-auto p-3 ">
        <h1 className="text-2xl font-bold">{selectedProduct.name}</h1>
        <div className="container mx-auto p-4 grid grid-cols-2">
          <div className="">
            <img
              src={imageSrc}
              alt={selectedProduct.name}
              className="w-full max-w-md mx-auto"
            />
          </div>
          <p className="text-lg text-gray-700 max-h-[350px] mb-4 border rounded-md border-slate-300 p-2 text-right overflow-y-scroll noscrollbar">
            {selectedProduct.description}
          </p>
          <p className="text-xl font-semibold text-teal-500">
            Price: {selectedProduct.price}
          </p>
          <section className="flex items-center gap-x-4 ">
            <Button
              classname="w-36 text-nowrap text-sm font-semibold bg-green-500 text-white flex items-center justify-center"
              text="افزودن به سبد خرید"
              onClick={() => handleAddToCart()}
            />
            <div>
              {quantityinp &&
                Number(
                  quantityinp.find(q => q._id == selectedProduct._id)?.quantity,
                ) > 0 &&
                quantityinp
                  .filter(q => q._id == selectedProduct._id)
                  .map(o => (
                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          dispatch(
                            AddToCartActions.PlusProductQuantity({
                              productId: o._id,
                            }),
                          )
                        }
                        className="w-5 bg-teal-300 hover:bg-teal-200 flex justify-center items-center h-7 cursor-pointer rounded-l-md"
                      >
                        <FaCaretUp />
                      </button>
                      <input
                        className="w-7 text-center h-7 "
                        type="text"
                        value={o.quantity}
                        onChange={e =>
                          dispatch(
                            AddToCartActions.updateProductQuantity({
                              productId: o._id,
                              quantity: Number(e.target.value),
                            }),
                          )
                        }
                      />

                      <button
                        onClick={() =>
                          dispatch(
                            AddToCartActions.MinusProductQuantity({
                              productId: o._id,
                            }),
                          )
                        }
                        className="w-5 bg-teal-300 hover:bg-teal-200 h-7 cursor-pointer flex justify-center items-center  rounded-r-md"
                      >
                        <FaCaretDown />
                      </button>
                    </div>
                  ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
