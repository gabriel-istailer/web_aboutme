import EmailVerificationController from "@/lib/controllers/EmailVerificationController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        await EmailVerificationController.sendEmail(body.email, body.isSignUp);
        return NextResponse.json({message: 'Verification email sent'}, {status: 201});
    } catch(error) {
        console.log('Error in the Route email-verifications/send API: ', error);
        return NextResponse.json({message: 'Error sending verification email'}, {status: 500});
    }
}