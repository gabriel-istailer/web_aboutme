import { NextResponse } from "next/server";
import UserController from "@/lib/controllers/UserController";

export async function PATCH(req) {
    try {
        const body = await req.json();
        const age = await UserController.updateBirthDateAndAge(body.birthDate, body.email);
        return NextResponse.json({ message: 'Your date of birth and age has been updated successfully', age}, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/update/birth_date: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}