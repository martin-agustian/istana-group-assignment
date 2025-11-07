import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const sortBy = searchParams.get("sort") || "";

		const where: any = {};

		let orderBy: any = { createdAt: "desc" };
		if (sortBy === "oldest") orderBy = { createdAt: "asc" };

    const [products, total] = await Promise.all([
			prisma.product.findMany({
				where,
				orderBy,
				skip: (page - 1) * pageSize,
				take: pageSize,
			}),
			prisma.product.count({ where }),
		]);

		return NextResponse.json({
      products,
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		});
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}