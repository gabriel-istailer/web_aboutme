import { NextResponse } from "next/server";
import UserController from "@/lib/controllers/UserController";

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json({ message: '', token: await UserController.createToken(body.email) }, { status: 201 });
    } catch (error) {
        
    }
}