import UserController from "@/lib/controllers/UserController";
import EmailVerificationController from "@/lib/controllers/EmailVerificationController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        if(!await EmailVerificationController.verifyCode(body.email, body.email_verification_code)) {
            return NextResponse.json({ message: 'Incorrect email verification code' }, { status: 200 });
        }
        return NextResponse.json({ message: 'Registration completed successfully!', token: await UserController.createUser(body) }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/signup: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}