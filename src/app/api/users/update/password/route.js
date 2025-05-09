import UserController from "@/lib/controllers/UserController";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        const body = await req.json();
        await UserController.updatePassword(body.password, body.email, false);
        return NextResponse.json({ message: 'User password updated successfully' }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/update/password', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}