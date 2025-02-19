import { NextResponse } from "next/server";
import emailVerification from "@/lib/nodemailer";

export async function POST(req) {
    try {
        const body = await req.json();
        
    } catch (error) {
        console.log('Erro na API Route cancel-email-verification: ', error);
    }
}