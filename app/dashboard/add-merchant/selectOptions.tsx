import {SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import { IoRestaurantSharp } from "react-icons/io5";


export const selectOptions = [

    <SelectGroup>
        <SelectLabel className="text-left text-lg font-bold flex items-center gap-1">
            <IoRestaurantSharp />
                餐厅
        </SelectLabel>
        <SelectItem key="1" value="清真餐厅">清真餐厅</SelectItem>
        <SelectItem key="2" value="中餐">中餐</SelectItem>
        <SelectItem key="3" value="西餐">西餐</SelectItem>
        <SelectItem key="8" value="烧烤">烧烤</SelectItem>
        <SelectItem key="9" value="火锅">火锅</SelectItem>
        <SelectItem key="10" value="日料">日料</SelectItem>
        <SelectItem key="11" value="韩餐">韩餐</SelectItem>
        <SelectLabel className="text-lg font-bold">饮品</SelectLabel>
        <SelectItem key="4" value="甜品">甜品</SelectItem>
        <SelectItem key="6" value="咖啡">咖啡</SelectItem>
        <SelectItem key="7" value="饮品">饮品</SelectItem>
        <SelectLabel className="text-lg font-bold">其它</SelectLabel>
        <SelectItem key="12" value="留学教育">留学教育</SelectItem>
        <SelectItem key="13" value="生活服务">生活服务</SelectItem>
        <SelectItem key="14" value="休闲娱乐">休闲娱乐</SelectItem>
        <SelectItem key="15" value="线上商家">线上商家</SelectItem>
    </SelectGroup>
 
];