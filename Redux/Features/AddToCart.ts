'use client';

import { IProductCard } from '@/components/Home/ProductCard';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  cart: IProductCard[];
}

const initialState: CartState = {
  cart: [],
};

const AddToCart = createSlice({
  name: 'AddToCart',
  initialState,
  reducers: {
    addProductToCart: (state, action: PayloadAction<IProductCard>) => {
      const existingProduct = state.cart.find(
        product => product._id === action.payload._id,
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        console.log(state.cart.map(e => e.name));

        state.cart.push({
          _id: action.payload._id,
          category: action.payload.category,
          subcategory: action.payload.subcategory,
          name: action.payload.name,
          price: action.payload.price,
          quantity: action.payload.quantity,
          brand: action.payload.brand,
          description: action.payload.description,
          thumbnail: action.payload.thumbnail,
          images: action.payload.images,
          slugname: action.payload.slugname,
        });
      }
    },
    // اکشن برای حذف محصول از سبد خرید
    removeProductFromCart: (state, action: PayloadAction<string>) => {
      // حذف محصول بر اساس شناسه آن
      state.cart = state.cart.filter(product => product._id !== action.payload);
    },
    // اکشن برای تغییر تعداد محصول در سبد خرید
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
    },
    // اکشن برای خالی کردن سبد خرید
    clearCart: state => {
      state.cart = [];
    },
  },
});

// صادر کردن اکشن‌ها و ریدوسر
export const AddToCartActions = AddToCart.actions;
export const AddToCartReducer = AddToCart.reducer;
