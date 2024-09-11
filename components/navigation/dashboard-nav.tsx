"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardNav({
  allLinks,
}: {
  allLinks: { label: string; path: string; icon: JSX.Element }[]
}) {
  const pathname = usePathname()
  return (
    <nav className="mx-10 my-4 py-3 overflow-auto mb-4">
      <ul className="flex gap-12 text-sm font-semibold ">
        <AnimatePresence>
          {allLinks.map((link) => (
            <motion.li whileTap={{ scale: 0.95 }} key={link.path}>
              <Link
                className={cn(
                  "flex gap-1 flex-col items-center relative",
                  pathname === link.path && "text-blue-500"
                )}
                href={link.path}
              >
                {/* <div className="hover:scale-125 transition-all duration-300 ease-in-out">
                  {link.icon}
                </div>
                <div className="hover:scale-125 transition-all duration-300 ease-in-out">
                  {link.label}
                </div> */}
                <div className="flex flex-col items-center hover:scale-125 transition-all duration-300 ease-in-out">
                  {link.icon}
                  {link.label}
                </div>
                
                {pathname === link.path ? (
                  <motion.div
                    className="h-[2px] w-full bg-blue-500 rounded-full absolute  z-0 left-0 -bottom-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 35 }}
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  )
}