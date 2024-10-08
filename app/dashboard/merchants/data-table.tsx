"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from "lucide-react"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting,setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),// return the result that match the filter that you typed
    onColumnFiltersChange: setColumnFilters,
    state:{
      sorting,
      columnFilters,
    }
  })

  return (
    <div className="rounded-md border mx-9">
      <Card>
        <CardHeader>
          <CardTitle>Merchants</CardTitle>
          <CardDescription className="text-gray-500">Update,Edit or Delete Your Merchants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div>
              <Input placeholder="Search By Merchant Name" 
                value={(table.getColumn("title")?.getFilterValue() as string ?? "")}
                onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end gap-12 pt-4">
              <button className="flex items-center justify-center bg-white hover:bg-[#ededf1]
                        px-6 py-2  rounded-md text-black font-bold text-sm  
                        transition duration-200 ease-linear"
                      disabled={!table.getCanPreviousPage()}
                      onClick={() => table.previousPage()}
              >
                  <ChevronLeft className="w-4 h-4"/>
                  <span>Previous Page</span>  
              </button>
              <button className="flex items-center  justify-center bg-white hover:bg-[#ededf1]
                        px-6 py-2  rounded-md text-black font-bold text-sm  
                        transition duration-200 ease-linear"
                      disabled={!table.getCanNextPage()}
                      onClick={() => table.nextPage()}
              >
                  <span>Next Page</span> 
                  <ChevronRight className="w-4 h-4"/> 
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}
