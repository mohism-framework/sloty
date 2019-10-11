export type ArgvOption = {
  desc: string;
  default: string;
}

export type Dict<T> = {
  [index: string]: T;
}