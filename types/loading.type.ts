export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: null | Error | string;
}
