import { BiSolidCartAdd } from 'react-icons/bi';
interface IProductCard {
  img: string;
  name: string;
  price: string;
  descriptipn: string;
}

const toPersianNumbers = (num: number | string) => {
  return num
    .toString()
    .replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[parseInt(digit, 10)]);
};

const ProductCard: React.FC<IProductCard> = ({
  img,
  price,
  name,
  descriptipn,
}) => {
  return (
    <main className="w-full max-w-72 h-96 border border-teal-300 p-3 rounded-md shadow-lg flex flex-col gap-y-3">
      <div className="w-full max-w-64 h-38 flex justify-center ">
        <img
          className="rounded-md w-full max-w-72 h-fit max-h-44"
          src={`http://localhost:8000/images/products/images/${img}`}
          alt={name}
        />
      </div>
      <div className="flex flex-col gap-y-4 h-full justify-around items-center w-full max-w-72">
        <p className="font-bold  text-slate-800">{name}</p>
        <p className="font-semibold text-xs text-slate-600 line-clamp-3  ">
          {descriptipn}
        </p>
        <div className="w-full flex justify-around items-center max-w-72">
          <p className="text-teal-500">تومان {toPersianNumbers(price)}</p>
          <div className="text-white bg-green-500 rounded-full w-10 h-10 flex justify-center items-center">
            <BiSolidCartAdd />
          </div>
        </div>
      </div>
    </main>
  );
};
export default ProductCard;
