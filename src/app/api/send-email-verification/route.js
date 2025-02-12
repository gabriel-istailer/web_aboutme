import { NextResponse } from "next/server";
import database from "@/lib/database";
import emailVerification from "@/lib/nodemailer";

export async function POST(req) {
    try {
        const body = await req.json();
        await emailVerification.sendEmailSignUp(body.email);
    } catch (error) {
        console.log('Erro no POST da API Route send-email-verification: ', error);
        return NextResponse.json({error: 'Erro no POST da API Route do servidor'}, {status: 500});
    }
}