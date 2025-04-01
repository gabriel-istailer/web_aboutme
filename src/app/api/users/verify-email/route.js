import UserController from "@/lib/controllers/UserController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json({message: 'Email verified on server successfully', isRegistered: await UserController.verifyUserEmail(body.email)}, {status: 200});
    } catch (error) {
        console.log('Route users/verify-email API error:', error);
        return NextResponse.json({message: 'Server Route API Error'}, {status: 500});
    }
}