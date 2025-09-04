import { NextResponse } from "next/server";
import UserController from "@/lib/controllers/UserController";

export async function PATCH(req) {
    try {
        const body = await req.json();
        console.log("Hobbies API: ", body.hobbies);
        await UserController.updateHobbies(body.hobbies, body.email);
        return NextResponse.json({ message: 'Your hobbies has been updated successfully' }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/update/hobbies: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}