import UserController from "@/lib/controllers/UserController";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        const body = await req.json();
        await UserController.updateName(body.name, body.email);
        return NextResponse.json({ message: 'Your name has been updated successfully' }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/update/name: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}