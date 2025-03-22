import EmailVerificationController from "@/lib/controllers/EmailVerificationController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        await EmailVerificationController.sendEmail(body.email, body.isSignUp);
        return NextResponse.json({message: 'Email verificação enviado.'}, {status: 201});
    } catch(error) {
        console.log('Erro na API Route email-verifications/send: ', error);
        return NextResponse.json({error: 'Erro ao enviar email de verificação.'}, {status: 500});
    }
}