import { ClassNames } from '@/utils/classname-join';

interface IButton {
  img?: any;
  text: string;
  number?: number;
  classname?: string;
}
const Button: React.FC<IButton> = ({ img, text, number, classname }) => {
  return (
    <main>
      <button
        className={ClassNames(
          'border shadow border-slate-900 flex flex-row justify-center items-center gap-x-2  w-32 h-10 rounded-md',
          `${classname}`,
        )}
      >
        {number && (
          <p className="w-1/6 h-full flex items-center justify-center">
            {number}
          </p>
        )}
        <p className="w-3/6 h-full flex items-center justify-center">{text}</p>
        {img && (
          <div className="w-1/6 flex justify-center text-center "> {img}</div>
        )}
      </button>
    </main>
  );
};
export default Button;
