import { NextResponse } from "next/server";
import UserController from "@/lib/controllers/UserController";

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json({ message: 'Password compared on server', isPassword: await UserController.comparePassword(body.email, body.password) }, { status: 200 });
    } catch (error) {
        console.log('Route users/verify/password API error:', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}