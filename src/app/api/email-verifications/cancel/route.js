import EmailVerificationController from "@/lib/controllers/EmailVerificationController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        EmailVerificationController.deleteEmailCode(body.email);
        return NextResponse.json({message: 'Verification email canceled'}, {status: 201});
    } catch (error) {
        console.log('Error in API Route email-verifications/cancel: ', error);
        return NextResponse.json({message: 'Error canceling verification email'}, {status: 500});
    }
}