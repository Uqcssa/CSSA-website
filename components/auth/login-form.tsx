"use client"

import { AuthCard } from "./auth-card"

export const LoginForm = () =>{
    return(
        <AuthCard 
            cardTitle="Welcome Back!" 
            backButtonLabel= "Create a new account" 
            backButtonHref="/auth/register" 
            
            showSocials
        >

        </AuthCard>
    )
} 