import { NextResponse } from "next/server";
import UserController from "@/lib/controllers/UserController";

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json({ message: 'User has successfully logged in', token: await UserController.createToken(body.email) }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/signin: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}