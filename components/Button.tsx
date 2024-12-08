import { ClassNames } from '@/utils/classname-join';

interface IButton {
  img?: any;
  text: string;
  number?: number;
  classname?: string;
  classnamefoText?: string;
  color?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement> | undefined) => void;
}
const Button: React.FC<IButton> = ({
  img,
  text,
  number,
  classname,
  color,
  classnamefoText,
  onClick,
}) => {
  return (
    <main>
      <button
        onClick={onClick}
        className={ClassNames(
          'border shadow  flex flex-row justify-end items-center gap-x-1  h-10 rounded-md hover:shadow-2xl hover:border-slate-300',
          `${classname}`,
        )}
      >
        {number && (
          <p className="w-1/6 h-full flex items-center  justify-center">
            {number}
          </p>
        )}
        <p
          className={ClassNames(
            'w-3/6   h-full flex items-center justify-center',
            `${classnamefoText}`,
          )}
        >
          {text}
        </p>
        {img && (
          <div
            className={ClassNames(
              'w-2/6 flex justify-center items-center text-center text-white z-10  bg-green-500 h-full rounded-r-md',
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
