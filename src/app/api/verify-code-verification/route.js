import { NextResponse } from "next/server";
import emailVerification from "@/lib/middlewares/nodemailer";

export async function POST(req) {
    try {
        const body = await req.json();
        
    } catch(error) {
        
    }
}