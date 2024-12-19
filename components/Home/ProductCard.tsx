import { AddToCartActions } from '@/Redux/Features/AddToCart';
import { RootState } from '@/Redux/store';
import { IProduct } from '@/types/Product';
import { BiSolidCartAdd } from 'react-icons/bi';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';

const toPersianNumbers = (num: number | string) => {
  return num
    .toString()
    .replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[parseInt(digit, 10)]);
};

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
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const product: IProductCard = {
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
    };
    dispatch(AddToCartActions.addProductToCart(product));
  };
  const quantityinp = useSelector((State: RootState) => State.AddToCart.cart);

  return (
    <main className="w-full max-w-72 h-96 border border-teal-300 p-3 rounded-md shadow-lg flex flex-col gap-y-3">
      <div className="w-full max-w-64 h-38 flex justify-center ">
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
          {quantityinp &&
          Number(quantityinp.find(q => q._id == _id)?.quantity) > 0 ? (
            quantityinp
              .filter(q => q._id == _id)
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
              ))
          ) : (
            <div
              className="text-white bg-green-500 cursor-pointer rounded-full w-10 h-10 flex hover:bg-green-400 justify-center items-center"
              onClick={() => handleAddToCart()}
            >
              <BiSolidCartAdd />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
export default ProductCard;
