import { ClassNames } from '@/utils/classname-join';
import { number } from 'zod';

interface IButton {
  img?: string;
  text: string;
  number?: number;
  classname?: string;
}
const Button: React.FC<IButton> = ({ img, text, number, classname }) => {
  return (
    <main>
      <button
        className={ClassNames(
          'border-2 border-slate-900 flex flex-row  w-32 h-10',
          `${classname}`,
        )}
      >
        {number && (
          <p className="w-1/6 h-full flex items-center justify-center">
            {number}
          </p>
        )}
        <p className="w-3/6 h-full flex items-center justify-center">{text}</p>
        {img && <img src={img} className="w-2/6 h-full" />}
      </button>
    </main>
  );
};
export default Button;
