import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // 1. for unauthorized user
    const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password");

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. authorized user
    const isProtectedPage =
        pathname.startsWith("/writePost") ||
        pathname === "/profile" ||
        pathname.startsWith("/profile/edit");

    if (isProtectedPage && !token) {
        const callbackUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(
            new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/writePost/:path*",
        "/profile",
        "/profile/edit/:path*",
    ],
};