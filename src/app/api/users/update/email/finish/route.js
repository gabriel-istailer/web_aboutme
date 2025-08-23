import { NextResponse } from "next/server";
import UserController from "@/lib/controllers/UserController";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        let token = searchParams.get('token');
        if(!token) {
            return NextResponse.json({ message: 'Token not found' }, { status: 404 });
        }

        try {
            token = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ message: 'Token invalid or expired' }, { status: 401 });
        }

        await UserController.updateEmail(token.newEmail, token.currentEmail);
        const newToken = await UserController.createToken(token.newEmail);

        return NextResponse.json({ message: 'Your email has been updated successfully!', token: newToken }, { status: 201 });
    } catch (error) {
        console.log('Error in API Route users/update/email/finish: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500});
    }
}