import { NextResponse } from "next/server";
import emailVerification from "@/lib/nodemailer";

export async function POST(req) {
    try {
        const body = await req.json();
        await emailVerification.sendEmail(body.email, body.isSignUp);
        return NextResponse.json({message: 'Email verificação enviado.'}, {status: 201});
    } catch(error) {
        console.log('Erro na API Route send-email-verification: ', error);
        return NextResponse.json({error: 'Erro ao enviar email de verificação.'}, {status: 500});
    }
}