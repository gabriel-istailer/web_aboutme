import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json({ message: 'User registration started, validate user email to complete' }, { status: 200 });
    } catch (error) {
        console.log('Error in API Route users/signup: ', error);
        return NextResponse.json({message: 'Server Route API Error'}, {status: 500});
    }
}