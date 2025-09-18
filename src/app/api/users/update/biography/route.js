import { NextResponse } from "next/server";
import UserController from "@/lib/controllers/UserController";

export async function PATCH(req) {
    try {
        const body = await req.json();
        await UserController.updateBiography(body.biography, body.email);
        return NextResponse.json({ message: 'Your biography has been updated successfully' }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/update/biography: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}