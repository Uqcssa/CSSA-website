import {SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import { Value } from "@radix-ui/react-select";
import { IoRestaurantSharp } from "react-icons/io5";


export const selectOptions = [

    <SelectGroup>
        <SelectItem key="1" value="文化">文化</SelectItem>
        <SelectItem key="2" value="节日">节日</SelectItem>
        <SelectItem key="3" value="学术">学术</SelectItem>
        <SelectItem key="4" value="娱乐">娱乐</SelectItem>
        <SelectItem key="5" value="体育">体育</SelectItem>
        <SelectItem key="6" value="社交">社交</SelectItem>
        <SelectItem key="7" value="商业">商业</SelectItem>
        <SelectItem key="8" value="技术">技术</SelectItem>
        <SelectItem key="9" value="艺术">艺术</SelectItem>
        <SelectItem key="10" value="教育">教育</SelectItem>
    </SelectGroup>
 
];

export const EventTypeMap: { [value: string]: string } = {
    "1": "文化",
    "2": "节日",
    "3": "学术",
    "4": "娱乐",
    "5": "体育",
    "6": "社交",
    "7": "商业",
    "8": "技术",
    "9": "艺术",
    "10": "教育",
}