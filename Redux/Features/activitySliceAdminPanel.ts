import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ActivityState = 'سفارشات' | 'کالاها' | 'موجودی و قیمت ها';

const initialState = 'کالاها';

const activitySliceAdminPanel = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivity: (state, action: PayloadAction<ActivityState>) =>
      action.payload,
  },
});

export const activityAdminPanelActions = activitySliceAdminPanel.actions;
export const activityAdminPanelReducer = activitySliceAdminPanel.reducer;
