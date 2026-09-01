/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore, Store } from "@reduxjs/toolkit";
import { decryptData } from "@sera-utils/encryptor";
import { createWrapper } from "next-redux-wrapper";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import logger from "redux-logger";
import createSagaMiddleware, { Task } from "redux-saga";

import rootSaga from "./sagas";
import rootReducer from "./slices";

export interface SagaStore extends Store {
  sagaTask?: Task;
}

export const makeStore = (_middleware?: any) => {
  const sagaMiddleware = createSagaMiddleware();
  const openReplayMiddleware = Array.isArray(_middleware) ? _middleware : null;

  const middlewares: any[] = [sagaMiddleware];
  if (openReplayMiddleware) middlewares.push(...openReplayMiddleware);
  if (decryptData(process.env.STAGE) !== "production") middlewares.push(logger);

  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
        immutableCheck: false,
        serializableCheck: false,
      }).concat(
        process.env.NODE_ENV !== "test" ? middlewares : [sagaMiddleware],
      ),
  });

  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const wrapper = createWrapper(makeStore, {
  debug: decryptData(process.env.STAGE) !== "production",
});
