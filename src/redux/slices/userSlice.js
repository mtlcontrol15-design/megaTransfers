import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    user: null,
    isSignedIn: false,
    deviceToken: null,
    hasCompletedOnboarding: false,
    isOnline: false,
    isAvailable: false,
    reviewedBookings: []

  },
  reducers: {
    dispatchToken: (state, action) => {
      state.token = action.payload;
    },
    dispatchUser: (state, action) => {
      state.user = action.payload;
    },
    dispatchIsSignedIn: (state, action) => {
      state.isSignedIn = action.payload;
    },
    completeOnboarding: (state) => {
      state.hasCompletedOnboarding = true;
    },
    dispatchAvailabilityStatus: (state, action) => {
      state.isAvailable = action.payload;
    },
    dispatchDeviceToken: (state, action) => {
      state.deviceToken = action.payload;
    },
    dispatchOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    dispatchReviewedBooking: (state, action) => {
      const bookingId = action.payload;

      if (!state.reviewedBookings.includes(bookingId)) {
        state.reviewedBookings.push(bookingId);
      }
    },
  },
});

export const { dispatchToken, dispatchUser, dispatchIsSignedIn, completeOnboarding, dispatchDeviceToken, dispatchOnlineStatus, dispatchReviewedBooking, dispatchAvailabilityStatus } = userSlice.actions;

export default userSlice.reducer;
