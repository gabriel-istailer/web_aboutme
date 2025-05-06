import UserController from "@/lib/controllers/UserController";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        if(!token && !email) {
            return NextResponse.json({ message: 'Data not found' }, { status: 404 });
        }
        const data = token ? token : email;
        const isToken = token ? true : false;

        const user = await UserController.get(data, isToken);

        return NextResponse.json({ message: 'User successfully verified on server', user }, { status: 200 });

    } catch (error) {
        console.log('Error in API Route users/get: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}