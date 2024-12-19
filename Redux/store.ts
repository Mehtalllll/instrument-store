import { configureStore } from '@reduxjs/toolkit';
import { activityAdminPanelReducer } from './Features/activitySliceAdminPanel';
import { categoriesAndSubcategoriesReducer } from './Features/CategorieAndSubcategorie';
import { AddToCartReducer } from './Features/AddToCart';

const Mystore = configureStore({
  reducer: {
    activity: activityAdminPanelReducer,
    categoriesAndSubcategories: categoriesAndSubcategoriesReducer,
    AddToCart: AddToCartReducer,
  },
});

export type RootState = ReturnType<typeof Mystore.getState>;
export type AppDispatch = typeof Mystore.dispatch;

export default Mystore;
