'use client';
import { fetchCategories } from '@/apis/categories';
import { fetchSubCategories } from '@/apis/subcategories';
import { IRescategories } from '@/types/categories';
import { IRessubcategories } from '@/types/subcategories';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { useDispatch } from 'react-redux';

interface ICatandSub {
  categories: IRescategories | null;
  subcategories: IRessubcategories | null;
  categorieId: string;
  subcategorieId: string;
}

const initialState: ICatandSub = {
  categorieId: '',
  subcategorieId: '',
  categories: null,
  subcategories: null,
};

const categoriesAndSubcategories = createSlice({
  name: 'categoriesAndSubcategories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<IRescategories>) => {
      state.categories = action.payload;
    },
    setCategoriesForFilter: (state, action: PayloadAction<string>) => {
      state.categorieId = action.payload;
    },
    setSubcategories: (state, action: PayloadAction<IRessubcategories>) => {
      state.subcategories = action.payload;
    },
    setsubCategoriesForFilter: (state, action: PayloadAction<string>) => {
      state.subcategorieId = action.payload;

      // پیدا کردن کتگوری مرتبط با این ساب‌کتگوری
      const relatedCategory = state.subcategories?.data?.subcategories.find(
        sub => sub._id === action.payload, // پیدا کردن ساب‌کتگوری با آیدی انتخاب‌شده
      )?.category;

      // اگر کتگوری پیدا شد، مقدار آن را تنظیم می‌کنیم
      if (relatedCategory) {
        state.categorieId = relatedCategory;
      }
    },
  },
});

export const categoriesAndSubcategoriesActions =
  categoriesAndSubcategories.actions;
export const categoriesAndSubcategoriesReducer =
  categoriesAndSubcategories.reducer;

const CategoriesAndSubcategoriesLoader = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const loadCategories = async () => {
      const result: IRescategories = await fetchCategories();
      dispatch(categoriesAndSubcategoriesActions.setCategories(result));
    };

    const loadSubcategories = async () => {
      const result2: IRessubcategories = await fetchSubCategories();
      dispatch(categoriesAndSubcategoriesActions.setSubcategories(result2));
    };

    loadCategories();
    loadSubcategories();
  }, [dispatch]);
};

export default CategoriesAndSubcategoriesLoader;
