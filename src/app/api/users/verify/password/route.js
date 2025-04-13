import { NextResponse } from "next/server";
import UserController from "@/lib/controllers/UserController";

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        return NextResponse.json({ message: 'Password compared on server', isPassword: await UserController.comparePassword(email, password) }, { status: 200 });
    } catch (error) {
        console.log('Route users/verify/password API error:', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}