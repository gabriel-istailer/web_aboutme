import UserController from "@/lib/controllers/UserController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json({ message: 'Password verified on server successfully', isPassword: await UserController.verifyUserPassword(body.email, body.password) }, { status: 200 });
    } catch (error) {
        console.log('Route users/verify-password API error: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}