import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        if(!token) {
            return NextResponse.json({ message: 'Token not found' }, { status: 404 });
        }

        try {
            token = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ message: 'Token invalid or expired' }, { statu: 401 });
        }

        return NextResponse.json({ message: 'Token validated successfully, please enter your new password', email: token.email }, { status: 200 });
    } catch (error) {
        console.log('Error in API Route users/signin/recover-password/verify: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}