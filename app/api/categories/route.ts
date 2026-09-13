
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories, { status: 200 });
    } catch(e) {
        console.error("Categories Fetch Error:", e);
        return NextResponse.json(
            { message: "Something went wrong while fetching categories" },
            { status: 500 }
        );
    }
}