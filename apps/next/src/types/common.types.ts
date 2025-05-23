// Common types and interfaces
import React from "react";

type StoreValueKeys<T extends object> = {
  [K in keyof T]: T[K] extends (..._args: unknown[]) => void ? never : K;
};

export type StoreInitialValues<T extends object> = Pick<
  T,
  StoreValueKeys<T>[keyof StoreValueKeys<T>]
>;

export type StorePreviousValue<T = unknown> = (_prev: T) => T;

export type StoreSetState<T> = (_payload: StorePreviousValue<T> | T) => void;

export interface LayoutProps {
  children: React.ReactNode;
}
