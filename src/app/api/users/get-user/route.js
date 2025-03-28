import UserController from "@/lib/controllers/UserController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json({ message: 'Usuário encontrado e entregado com sucesso', user: await UserController.getUserByToken(body.token) }, { status: 200 });
    } catch (error) {
        console.log('Erro na API Route users/get-user:', error);
        return NextResponse.json({ message: 'Erro na API Route do servidor' }, { status: 500 });
    }
}