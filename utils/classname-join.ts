export const ClassNames = (...classname: string[]) => {
  return classname.filter(Boolean).join(' ');
};
