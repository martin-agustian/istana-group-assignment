import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { getAuthorization } from "@/commons/helper";
import { authOptions } from "@/lib/auth";
import { UserModel } from "@/types/model/User";

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

    const session = await getServerSession(authOptions);
    const authorization = getAuthorization(req);
    const sessionUser = (session?.user ?? authorization.user) as UserModel;
    if (!sessionUser || orderData.userId != sessionUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ ...orderData });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}