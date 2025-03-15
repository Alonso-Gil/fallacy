// Common types and interfaces

type StoreValueKeys<T extends object> = {
  [K in keyof T]: T[K] extends (...args: any[]) => void ? never : K;
};

export type StoreInitialValues<T extends object> = Pick<
  T,
  StoreValueKeys<T>[keyof StoreValueKeys<T>]
>;

export type StorePreviousValue<T = unknown> = (prev: T) => T;

export type StoreSetState<T> = (payload: StorePreviousValue<T> | T) => void;

export interface PageProps {}

export interface LayoutProps {
  children: React.ReactNode;
}
