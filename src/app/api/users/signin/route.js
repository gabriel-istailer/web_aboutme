import UserController from "@/lib/controllers/UserController";
import EmailVerificationController from "@/lib/controllers/EmailVerificationController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        if(!await EmailVerificationController.verifyCode(body.email, body.email_verification_code)) {
            return NextResponse.json({ message: 'Incorrect email verification code' }, { status: 200 });
        }
        return NextResponse.json({ message: 'Connected successfully', token: await UserController.createUserToken(body.email) }, { status: 201 });
    } catch (error) {
        console.log('Route users/signin API error: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}