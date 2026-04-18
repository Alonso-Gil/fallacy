// Common types and interfaces
import React from "react";

type StoreNonFunctionKeys<T extends object> = {
  [K in keyof T]: T[K] extends (..._args: never[]) => unknown ? never : K;
}[keyof T];

export type StoreInitialValues<T extends object> = Pick<
  T,
  StoreNonFunctionKeys<T>
>;

export type StorePreviousValue<T = unknown> = (_prev: T) => T;

export type StoreSetState<T> = (_payload: StorePreviousValue<T> | T) => void;

export interface LayoutProps {
  children: React.ReactNode;
}
