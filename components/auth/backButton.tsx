"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"


export const BackButton = ({
    href, 
    label,
} : {
    href: string
    label: string
}) => {
    return(
        <Button asChild variant={"link"} className="font-medium w-full text-purple-600">
            <Link aria-label={label} href={href}>
                {label}
            </Link>
        </Button>
    )
}