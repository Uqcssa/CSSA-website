import { auth } from "@/server/auth"
import { Settings, Truck, BarChart, PenSquare, Package, CalendarArrowUp, CalendarHeart, Store } from "lucide-react"
import { MdAddBusiness } from "react-icons/md";
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation";
import DashboardNav from "@/components/navigation/dashboard-nav"


// import DashboardNav from "@/components/navigation/dashboard-nav"


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    //check if the user log in ,and check the user identity
    const session = await auth()
    // const pathname = usePathname();
    const userLinks =[
        {
            label:"Orders",
            path:"/dashboard/orders",
            icon:<Truck size={20}/>
        },
        {
            label:"Settings",
            path:"/dashboard/settings",
            icon:<Settings size={20}/>
        },
    ] as const

    //check if user identity is admin then show the following component
    const adminLinks =
        session?.user.role === "admin"
            ? [
                {
                    label: "Analytics",
                    path: "/dashboard/analytics",
                    icon: <BarChart size={20} />,
                  },
                //   上传商家的信息以及上传的链接
                  {
                    label: "Create merchant",
                    path: "/dashboard/add-merchant",
                    icon: <Store size={20} />,
                  },
                //  已经上传的商家及展示链接 
                  {
                    label: "Merchant",
                    path: "/dashboard/merchants",
                    icon: <Package size={20} />,
                  },
                  //  上传活动的信息以及相应的上传链接
                  {
                    label: "Create Event",
                    path: "/dashboard/add-events",
                    icon: <CalendarArrowUp size={20} />,
                  },
                  //  已经上传的活动及展示链接 
                  {
                    label: "Events",
                    path: "/dashboard/events",
                    icon: <CalendarHeart size={20} />,
                  },
             ]
            : []
    
    //check if user identity is cssaStudent then show the following component
    const cssaStudentLinks =
        session?.user.role === "cssaStudent"
            ? [
                //   上传商家的信息以及上传的链接
                  {
                    label: "Create merchant",
                    path: "/dashboard/add-merchant",
                    icon: <Store size={20} />,
                  },
                //  已经上传的商家及展示链接 
                  {
                    label: "Merchants",
                    path: "/dashboard/merchants",
                    icon: <Package size={20} />,
                  },
             ]
            : []

    const allLinks = [...adminLinks, ...userLinks, ...cssaStudentLinks]

    return(
        
            <div>
              <DashboardNav allLinks={allLinks} />
              {children}
            </div>
    
    )
}