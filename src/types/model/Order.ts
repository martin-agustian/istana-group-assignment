import { ProductModel } from "./Product";

export type OrderModel = {
	id: string;
  userId: string;
	code: string;
	createdAt: Date;
  items: ProductModel[];
};
