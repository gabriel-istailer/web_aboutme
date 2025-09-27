import UserController from "@/lib/controllers/UserController";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const id = searchParams.get('id');
        
        if(!token && !email && !id) {
            return NextResponse.json({ message: 'Data not found' }, { status: 404 });
        }
        let data = token ? token : email;
        if(!data) {
            data = id;
            const user = await UserController.getById(data);
            return NextResponse.json({ message: 'User successfully verified on server', user }, { status: 200 });
        }
        const isToken = token ? true : false;

        const user = await UserController.get(data, isToken);

        return NextResponse.json({ message: 'User successfully verified on server', user }, { status: 200 });

    } catch (error) {
        console.log('Error in API Route users/get: ', error);
        return NextResponse.json({ message: 'Server Route API Error' }, { status: 500 });
    }
}