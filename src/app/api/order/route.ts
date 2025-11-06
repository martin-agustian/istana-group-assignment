import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import z from "zod";
import { orderSchema } from "@/schemas/orderSchema";

export async function GET(req: Request) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: 1 },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      orders
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validate = orderSchema.safeParse(body);
    if (!validate.success) {
      return NextResponse.json({ error: z.flattenError(validate.error) }, { status: 400 });
    }

    const { items } = body;

    const result = await prisma.$transaction(async (prismaTx) => {
      const orderCreated = await prismaTx.order.create({
        data: { userId: 1 },
      });

      for (const item of items) {
        const product = await prismaTx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw `Product ${item.productId} not found`;
        if (product.stock < item.quantity) throw `Insufficient stock for ${product.name}`;

        await prismaTx.orderItem.create({
          data: {
            orderId: orderCreated.id,
            productId: product.id,
            quantity: item.quantity,
            priceAt: product.price,
          },
        });

        await prismaTx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });
      }

      return orderCreated;
    });

    return NextResponse.json({ ...result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}