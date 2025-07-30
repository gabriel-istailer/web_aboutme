import { NextResponse } from "next/server";
import NodemailerController from "@/lib/controllers/NodemailerController";

export async function POST(req) {
    try {
        const body = await req.json();
        await NodemailerController.sendEmailVerificationToUpdate(body);
        return NextResponse.json({ message: 'Verification email sent to new email' }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/update/email: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}