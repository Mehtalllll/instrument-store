import { ClassNames } from '@/utils/classname-join';

interface IButton {
  img?: any;
  text: string;
  number?: number;
  classname?: string;
  color: string;
}
const Button: React.FC<IButton> = ({ img, text, number, classname, color }) => {
  return (
    <main>
      <button
        className={ClassNames(
          'border shadow  flex flex-row justify-end items-center gap-x-1 w-36 h-10 rounded-md hover:shadow-2xl hover:border-slate-300',
          `${classname}`,
        )}
      >
        {number && (
          <p className="w-1/6 h-full flex items-center  justify-center">
            {number}
          </p>
        )}
        <p className="w-3/6 h-full flex items-center justify-center">{text}</p>
        {img && (
          <div
            className={ClassNames(
              'w-2/6 flex justify-center items-center text-center text-white bg-green-500 h-full rounded-r-md',
              `${color}`,
            )}
          >
            {img}
          </div>
        )}
      </button>
    </main>
  );
};
export default Button;
