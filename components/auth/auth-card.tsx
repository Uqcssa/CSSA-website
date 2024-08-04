import { Card } from "@/components/ui/card"
import { CardHeader } from "@chakra-ui/react"

type CardWrapperProps ={
    children: React.ReactNode
    cardTitle:string
    backButtonHref:string
    backButtonLabel:string
    showSocials?:string
}


export const AuthCard =({
    children,
    cardTitle,
    backButtonHref,
    backButtonLabel,
    showSocials,
} : CardWrapperProps) => {
    <Card>
        <CardHeader>
            
        </CardHeader>
    </Card>
}