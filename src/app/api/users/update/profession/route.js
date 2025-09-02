import { NextResponse } from "next/server";
import UserController from "@/lib/controllers/UserController";

export async function PATCH(req) {
    try {
        const body = await req.json();
        await UserController.updateProfession(body.profession, body.email);
        return NextResponse.json({ message: 'Your profession has been updated successfully' }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/update/profession: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}