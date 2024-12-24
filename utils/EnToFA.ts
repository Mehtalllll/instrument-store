const toPersianNumbers = (num: number | string) => {
  return num
    .toString()
    .replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[parseInt(digit, 10)]);
};
export default toPersianNumbers;
