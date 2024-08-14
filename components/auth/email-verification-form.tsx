"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"

export const EmailVerificationForm = () =>{
    const token = useSearchParams().get("token")
    const router = useRouter();
}