import UserController from "@/lib/controllers/UserController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json({message: 'Email verificado no banco de dados', isRegistered: await UserController.verifyUser(body.email)}, {status: 200});
    } catch (error) {
        console.log('Erro na API Route verify-user-email: ', error);
        return NextResponse.json({message: 'Erro na API Route do servidor'}, {status: 500});
    }
}