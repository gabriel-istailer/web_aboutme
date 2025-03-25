import UserController from "@/lib/controllers/UserController";
import EmailVerificationController from "@/lib/controllers/EmailVerificationController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log(body);
        if(!await EmailVerificationController.verifyCode(body.email, body.email_verification_code)) {
            return NextResponse.json({ message: 'Código de verificação de email incorreto' }, { status: 200 });
        }
        return NextResponse.json({ message: 'Cadastro concluído com sucesso!', token: await UserController.createUser(body) }, { status: 201 });
    } catch (error) {
        console.log('Erro na API Route users/signup: ', error);
        return NextResponse.json({ message: 'Erro na API Route do servidor' }, { status: 500 });
    }
}