import UserController from "@/lib/controllers/UserController";
import EmailVerificationController from "@/lib/controllers/EmailVerificationController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json();
    } catch (error) {
        console.log('Erro na API Route users/signup: ', error);
        return NextResponse.json({ message: 'Erro na API Route do servidor' }, { status: 500 });
    }
}