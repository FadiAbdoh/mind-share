
import { NextResponse } from "next/server";
import prisma from '@/lib/prismadb';
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();
        if(!name || !email || !password) {
            return NextResponse.json({error: 'All fields are required'}, {status: 400});
        }
        const existingUser = await prisma.user.findUnique({
            where: {email}
        });

        if(existingUser) {
            return NextResponse.json({ error: 'Email address already exists' }, {status: 400});
        }

        const hashedPass = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                hashedPass,
                email
            }
        });
        return NextResponse.json(user, {status: 200});
    } catch(e) {
        return NextResponse.json({ error: "A server error occurred" }, { status: 500 });
    }
}