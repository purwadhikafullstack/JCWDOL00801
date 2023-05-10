import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userReducer";
import { dateReducer } from "./dateReducer";
import { tenantReducer } from "./tenantReducer";
import { dateBook } from "./dateBook.js";

export const globalStore = configureStore({
  reducer: { userReducer, dateReducer, tenantReducer, dateBook },
});
