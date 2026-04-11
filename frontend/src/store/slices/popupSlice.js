import { createSlice } from "@reduxjs/toolkit";
const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isCreateStudentModalOpen: false,
    isCreateTeacherModalOpen: false,
    isDeadlineModalOpen: false,
  },
  reducers: {
    toggleStudentModel(state) {
      state.isCreateStudentModalOpen = !state.isCreateStudentModalOpen;
    },
    toggleTeacherModel(state) {
      state.isCreateTeacherModalOpen = !state.isCreateTeacherModalOpen;
    },
    toggleDeadlineModel(state) {
      state.isDeadlineModalOpen = !state.isDeadlineModalOpen;
    },
  },
});
export const { toggleStudentModel, toggleTeacherModel,toggleDeadlineModel } = popupSlice.actions;
export default popupSlice.reducer;
