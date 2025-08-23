import UserController from "@/lib/controllers/UserController";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        
    } catch (error) {
        console.log('Error in API Route users/update/name: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}