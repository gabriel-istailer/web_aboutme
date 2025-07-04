import { NextResponse } from "next/server";
import UserController from "@/lib/controllers/UserController";
import jwt from 'jsonwebtoken';

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

        const userToken = await UserController.create(token);

        return NextResponse.json({ message: 'User validated and registered successfully!', token: userToken }, { status: 201 });

    } catch (error) {
        console.log('Error in API Route users/signup/finish: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}