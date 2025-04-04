import UserController from "@/lib/controllers/UserController";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json({ message: 'User found and successfully delivered', user: await UserController.getUserByToken(body.token) }, { status: 200 });
    } catch (error) {
        console.log('Error in Route users/get-user API: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}