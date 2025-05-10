import { NextResponse } from "next/server";
import NodemailerController from "@/lib/controllers/NodemailerController";
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const email = searchParams.get('email');

        await NodemailerController.sendPasswordRecovery(email);

        return NextResponse.json({ message: 'Password recovery sent to user by email' }, { status: 200 });

    } catch (error) {
        console.log('Erro in API Route users/signin/recover-password: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}