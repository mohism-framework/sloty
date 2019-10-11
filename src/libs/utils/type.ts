export type ArgvOption = {
  desc: string;
  default: any;
}

export type Dict<T> = {
  [index: string]: T;
}