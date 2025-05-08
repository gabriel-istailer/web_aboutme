'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function RecoveryPassword() {

    async function handleSubmit(e) {
        e.preventDefault();


        
    }

    return (
        <div className="RecoveryPassword">
            <form onSubmit={handleSubmit} className="formLayout-form">

            </form>
        </div>
    );
}