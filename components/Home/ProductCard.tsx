import {
  addItemToCart,
  deleteProductFromCart,
  fetchCart,
} from '@/apis/PostCart';
import { getSession } from '@/apis/Session-management';
import { AddToCartActions } from '@/Redux/Features/AddToCart';
import { RootState } from '@/Redux/store';
import { IProduct } from '@/types/Product';
import toPersianNumbers from '@/utils/EnToFA';
import Link from 'next/link';
import React from 'react';
import { BiSolidCartAdd } from 'react-icons/bi';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

export interface IProductCard {
  _id: string;
  images: string[];
  name: string;
  price: number;
  quantity: number;
  description: string; // اصلاح از descriptipn به description
  category: string;
  subcategory: string;
  brand: string;
  slugname: string;
  thumbnail: string;
}

const ProductCard: React.FC<IProductCard> = ({
  _id,
  category,
  subcategory,
  name,
  price,
  quantity,
  brand,
  description,
  thumbnail,
  images,
  slugname,
}) => {
  const [userid, setuserid] = React.useState<string | null>(
    getSession('UserId'),
  );
  const [reload, setreload] = React.useState<boolean>(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const orderforApi = useQuery(
    ['orderforApi', userid, reload],
    () => fetchCart(userid as string),
    {
      keepPreviousData: true,
      staleTime: 5000,
      onSuccess: () => setreload(false),
    },
  );

  const removeProductMutation = useMutation(
    (id: string) => deleteProductFromCart(userid as string, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orderforApi');
      },
    },
  );

  const increaseQuantityMutation = useMutation(
    (product: any) => addItemToCart(userid as string, product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orderforApi');
      },
    },
  );

  const handleRemoveProduct = (id: string) => {
    removeProductMutation.mutate(id);
  };

  const handleIncreaseQuantity = (product: any) => {
    increaseQuantityMutation.mutate(product);
  };

  const handleAddToCart = () => {
    const product: IProductCard = {
      _id: _id,
      category: category,
      subcategory: subcategory,
      name: name,
      price: price,
      quantity: quantity,
      brand: brand,
      description: description,
      thumbnail: thumbnail,
      images: images,
      slugname: slugname,
    };
    dispatch(AddToCartActions.addProductToCart(product));
    userid && handleIncreaseQuantity(product);
  };

  const handleUpdateQuantity = (productId: string) => {
    dispatch(AddToCartActions.MinusProductQuantity({ productId: productId }));
  };

  const quantityinp = useSelector((State: RootState) => State.AddToCart.cart);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // جلوگیری از ارسال کلیک به لینک
    handleAddToCart();
  };

  // این تابع برای هدایت به صفحه محصول
  const handleProductClick = (id: string) => {
    // با کلیک بر روی کارت، به صفحه محصول هدایت می‌شود
    window.location.href = `/products/${id}`;
  };
  return (
    // <Link key={_id} href={`./products/${_id}`}>
    <main className="w-full max-w-72 h-96 border border-teal-300 p-3 rounded-md shadow-lg flex flex-col gap-y-3">
      <div
        onClick={() => handleProductClick(_id)}
        className="w-full max-w-64 h-38 flex justify-center cursor-pointer "
      >
        <img
          className="rounded-md w-full max-w-72 h-fit max-h-44"
          src={`http://localhost:8000/images/products/images/${images[0]}`}
          alt={name}
        />
      </div>
      <div className="flex flex-col gap-y-4 h-full justify-around items-center w-full max-w-72">
        <p className="font-bold  text-slate-800">{name}</p>
        <p className="font-semibold text-xs text-slate-600 line-clamp-3  ">
          {description}
        </p>
        <div className="w-full flex justify-around items-center max-w-72">
          <p className="text-teal-500">تومان {toPersianNumbers(price)}</p>
          {!!userid ? (
            orderforApi.isSuccess &&
            Number(
              orderforApi.data.find(
                q => q.product._id == _id && q.userId == userid,
              )?.quantity,
            ) > 0 ? (
              orderforApi.data
                .filter(q => q.product._id == _id)
                .map(o => (
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleIncreaseQuantity(o.product)}
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
                            productId: o.product._id,
                            quantity: Number(e.target.value),
                          }),
                        )
                      }
                    />

                    <button
                      onClick={() => handleRemoveProduct(o.product._id)}
                      className="w-5 bg-teal-300 hover:bg-teal-200 h-7 cursor-pointer flex justify-center items-center  rounded-r-md"
                    >
                      <FaCaretDown />
                    </button>
                  </div>
                ))
            ) : (
              <div
                className="text-white bg-green-500 cursor-pointer rounded-full w-10 h-10 flex hover:bg-green-400 justify-center items-center"
                onClick={handleAddToCartClick}
              >
                <BiSolidCartAdd />
              </div>
            )
          ) : quantityinp &&
            Number(quantityinp.find(q => q._id == _id)?.quantity) > 0 ? (
            quantityinp
              .filter(q => q._id == _id)
              .map(o => (
                <div className="flex justify-center">
                  <button
                    onClick={() => handleAddToCart()}
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
                    onClick={() => handleUpdateQuantity(o._id)}
                    className="w-5 bg-teal-300 hover:bg-teal-200 h-7 cursor-pointer flex justify-center items-center  rounded-r-md"
                  >
                    <FaCaretDown />
                  </button>
                </div>
              ))
          ) : (
            <div
              className="text-white bg-green-500 cursor-pointer rounded-full w-10 h-10 flex hover:bg-green-400 justify-center items-center"
              onClick={handleAddToCartClick}
            >
              <BiSolidCartAdd />
            </div>
          )}
        </div>
      </div>
    </main>
    // </Link>
  );
};
export default ProductCard;
function addToCart() {
  throw new Error('Function not implemented.');
}
