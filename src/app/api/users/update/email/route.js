import { NextResponse } from "next/server";
import NodemailerController from "@/lib/controllers/NodemailerController";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const email = searchParams.get('email');

        await NodemailerController.sendEmailVerificationToUpdate(email);

        return NextResponse.json({ message: 'Verification email sent to new email' }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/update/email: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}