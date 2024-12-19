'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProductCard } from '@/components/Home/ProductCard';
import toast from 'react-hot-toast';

// تعریف نوع وضعیت سبد خرید
interface CartState {
  cart: IProductCard[];
}

// بارگذاری داده‌ها از localStorage (اگر وجود داشته باشد)
const loadCartFromLocalStorage = (): IProductCard[] => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

// وضعیت اولیه
const initialState: CartState = {
  cart: loadCartFromLocalStorage(),
};

// ذخیره سبد خرید در localStorage
const saveCartToLocalStorage = (cart: IProductCard[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

const AddToCart = createSlice({
  name: 'AddToCart',
  initialState,
  reducers: {
    // اضافه کردن محصول به سبد خرید
    addProductToCart: (state, action: PayloadAction<IProductCard>) => {
      const existingProduct = state.cart.find(
        product => product._id === action.payload._id,
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.cart.push({
          ...action.payload,
          quantity: 1,
        });
      }
      saveCartToLocalStorage(state.cart); // ذخیره وضعیت جدید
      toast.success(`محصول به سبد خرید اضافه شد`);
    },
    // حذف محصول از سبد خرید
    removeProductFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(product => product._id !== action.payload);
      saveCartToLocalStorage(state.cart); // ذخیره وضعیت جدید
      toast.error(`محصول از سبد خرید حذف شد`);
    },
    // تغییر تعداد محصول
    updateProductQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const product = state.cart.find(
        item => item._id === action.payload.productId,
      );
      if (product) {
        product.quantity = action.payload.quantity;
      }
      saveCartToLocalStorage(state.cart); // ذخیره وضعیت جدید
    },
    // افزایش تعداد محصول
    PlusProductQuantity: (
      state,
      action: PayloadAction<{ productId: string }>,
    ) => {
      const product = state.cart.find(
        item => item._id === action.payload.productId,
      );
      if (product) {
        product.quantity += 1;
      }
      saveCartToLocalStorage(state.cart); // ذخیره وضعیت جدید
    },
    // کاهش تعداد محصول
    MinusProductQuantity: (
      state,
      action: PayloadAction<{ productId: string }>,
    ) => {
      const product = state.cart.find(
        item => item._id === action.payload.productId,
      );
      if (product && product.quantity > 0) {
        product.quantity -= 1;
      }
      saveCartToLocalStorage(state.cart); // ذخیره وضعیت جدید
    },
    // خالی کردن سبد خرید
    clearCart: state => {
      state.cart = [];
      saveCartToLocalStorage(state.cart); // حذف اطلاعات از localStorage
    },
  },
});

// صادر کردن اکشن‌ها و ریدوسر
export const AddToCartActions = AddToCart.actions;
export const AddToCartReducer = AddToCart.reducer;
