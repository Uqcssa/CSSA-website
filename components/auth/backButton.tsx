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
        <Button className="font-medium w-full text-black">
            <Link aria-label={label} href={href}>
                {label}
            </Link>
        </Button>
    )
}