import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ orderCode: string }> }) {
  try {
    const { orderCode } = await params;

    const orderData = await prisma.order.findUnique({
			where: { code: orderCode },
      include: { items: { include: { product: true } } },
		});

		if (!orderData) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

    return NextResponse.json({ ...orderData });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}