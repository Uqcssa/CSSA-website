'use client'
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Link from "next/link"

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]

export function DrawerButton() {
  const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Drawer>
      <DrawerTrigger asChild className="h-20 w-52 mt-16">
        <Button variant="outline" className="border-black text-3xl shadow-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 ">了解更多</Button>
      </DrawerTrigger>
      <DrawerContent className="bg-gradient-to-t">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center text-4xl text-white">其他部门</DrawerTitle>
            
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Link href={"/members/media"} >
                <button className="px-4 py-2 rounded-md border-none  text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                    <p className="text-2xl" >传媒部</p>
                </button>
              </Link>
              <Link href={"/members/eventG"} >
                <button className="px-4 py-2 rounded-md border-none  text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                    <p className="text-2xl" >活动部</p>
                </button>
              </Link>
              <Link href={"/members/working"} >
                <button className="px-4 py-2 rounded-md border-none  text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                    <p className="text-2xl" >职规部</p>
                </button>
              </Link>
              <Link href={"/members/marketing"} >
                <button className="px-6 py- rounded-md border-none  text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                    <p className="text-2xl" >外联部</p>
                </button>
              </Link> 
            </div>
            <div className="mt-3 h-[60px]">
              
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="mb-3 text-white border-none text-3xl hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">取消</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
export default DrawerButton;
