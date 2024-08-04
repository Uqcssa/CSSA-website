"use client"

import { Button } from "@chakra-ui/react"
import { Link } from "lucide-react"

type BackButtonType = {
    href: string
    label: string
}
export const BackButton = ({href, label} : BackButtonType) =>{
    return(
        <Button className="font-medium w-full">
            <Link aria-label={label} href={href}>
                {label}
            </Link>
        </Button>
    )
}