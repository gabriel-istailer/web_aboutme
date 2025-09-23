import { NextResponse } from "next/server";
import UserController from "@/lib/controllers/UserController";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log(body);
        await UserController.delete(body.email);
        return NextResponse.json({ message: 'Your account has been successfully deleted.', status: 201 }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/delete: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}