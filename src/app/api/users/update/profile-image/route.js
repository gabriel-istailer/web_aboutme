import UserController from "@/lib/controllers/UserController";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        const formData = await req.formData();
        const email = formData.get('email');
        const file = formData.get('file');
        await UserController.updateProfileImage(email, file);
        return NextResponse.json({ message: 'User profile picture updated successfully' }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/update/profile-image: ', error);
        return NextResponse.json({message: 'Server Route API Error'}, {status: 500});
    }
}