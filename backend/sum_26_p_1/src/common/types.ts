import { ResponseMeta } from './pagination';

export type StandardShape<T> = {
  data: T;
  statusCode: number;
  message?: string;
};

export type PaginatedShape<T> = {
  items: T[];
  meta: ResponseMeta;
  statusCode: number;
  message?: string;
};

export type MessageShape = {
  statusCode: number;
  message: string;
};

export type TransformShape<T = object> = StandardShape<T> | PaginatedShape<T> | MessageShape;
