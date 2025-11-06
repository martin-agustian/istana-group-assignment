import { z } from "zod";

// Schema for each item
const orderItemSchema = z.object({
  productId: z.number("productId is required").int().positive("productId must be a positive integer"),
  quantity: z.number("quantity is required").int().positive("quantity must be a positive integer"),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).nonempty("items array cannot be empty"),
});

export type OrderSchema = z.infer<typeof orderSchema>;
export type OrderSchemaErrors = Partial<Record<keyof OrderSchema, string[]>>;
