import { NextResponse } from "next/server";
import emailVerification from "@/lib/nodemailer";

export async function POST(req) {
    try {
        const body = await req.json();
        emailVerification.deleteEmailCode(body.email);
        return NextResponse.json({message: 'Email de verificação cancelado'}, {status: 201});
    } catch (error) {
        console.log('Erro na API Route cancel-email-verification: ', error);
        return NextResponse.json({message: 'Erro ao cancelar o email de verificação'}, {status: 500});
    }
}