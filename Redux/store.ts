import { configureStore } from '@reduxjs/toolkit';
import { activityAdminPanelReducer } from './Features/activitySliceAdminPanel';

const Mystore = configureStore({
  reducer: {
    activity: activityAdminPanelReducer,
  },
});

export type RootState = ReturnType<typeof Mystore.getState>;
export type AppDispatch = typeof Mystore.dispatch;

export default Mystore;
