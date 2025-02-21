import { NextResponse } from "next/server";
import database from "@/lib/database";

export async function POST(req) {
    try {
        const body = await req.json();
        const sql = `SELECT * FROM ${process.env.DATABASE_USERS_TABLE} WHERE email = ?`;
        const results = database.query(sql, [body.email]);
        console.log(results[0]);
        return NextResponse.json({message: 'Email verificado no banco de dados', isRegistered: true}, {status: 200});
    } catch (error) {
        console.log('Erro na API Route verify-user-email: ', error);
        return NextResponse.json({message: 'Erro na API Route do servidor'}, {status: 500});
    }
}