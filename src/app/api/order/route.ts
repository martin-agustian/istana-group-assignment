import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import z from "zod";
import { orderSchema } from "@/schemas/orderSchema";

import { customAlphabet } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAuthorization } from "@/commons/helper";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const sortBy = searchParams.get("sort") || "";

    const where: any = {};

		let orderBy: any = { createdAt: "desc" };
		if (sortBy === "oldest") orderBy = { createdAt: "asc" }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: 1 },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
				skip: (page - 1) * pageSize,
				take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),      
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const authorization = getAuthorization(req);
    const sessionUser = session?.user ?? authorization.user;
		if (!sessionUser) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

    const body = await req.json();

    const validate = orderSchema.safeParse(body);
    if (!validate.success) {
      return NextResponse.json({ error: z.flattenError(validate.error) }, { status: 400 });
    }

    const { items } = body;

    const result = await prisma.$transaction(async (prismaTx) => {
      const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);

      const orderCreated = await prismaTx.order.create({
        data: { 
          userId: 1,
          code: nanoid(),
        },
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