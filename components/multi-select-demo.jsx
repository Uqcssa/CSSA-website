'use client'

import * as React from "react"
import { X } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export function MultiSelectDemoComponent() {
  const [selectedItems, setSelectedItems] = React.useState([])

  const handleSelect = (value) => {
    if (!selectedItems.includes(value)) {
      setSelectedItems([...selectedItems, value])
    }
  }

  const handleRemove = (value) => {
    setSelectedItems(selectedItems.filter(item => item !== value))
  }

  return (
    (<div className=" space-y-4">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className=" w-[180px]">
          <SelectValue placeholder="Select fruits" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className=" flex  flex-wrap  gap-2">
        {selectedItems.map((item) => (
          <Button
            key={item}
            variant="secondary"
            size="sm"
            className=" rounded-full"
            onClick={() => handleRemove(item)}>
            {item}
            <X className=" ml-2  h-4  w-4" />
          </Button>
        ))}
      </div>
    </div>)
  );
}