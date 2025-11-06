import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
		const products = await prisma.product.findMany();

		return NextResponse.json({
			products
		});
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}