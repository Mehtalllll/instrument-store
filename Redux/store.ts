import { configureStore } from '@reduxjs/toolkit';
import { activityAdminPanelReducer } from './Features/activitySliceAdminPanel';
import { categoriesAndSubcategoriesReducer } from './Features/CategorieAndSubcategorie';

const Mystore = configureStore({
  reducer: {
    activity: activityAdminPanelReducer,
    categoriesAndSubcategories: categoriesAndSubcategoriesReducer,
  },
});

export type RootState = ReturnType<typeof Mystore.getState>;
export type AppDispatch = typeof Mystore.dispatch;

export default Mystore;
