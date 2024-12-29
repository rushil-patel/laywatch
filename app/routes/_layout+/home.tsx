import type { LoaderFunctionArgs } from '@remix-run/node'
import { Form, json, useLoaderData } from '@remix-run/react'
import MetricRepository from '~/repository/metric-repository'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { authenticator } from '~/services/auth/config.server'

import * as React from 'react'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMemo } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BellIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import { AlertModal } from '~/components/alert/alert-modal'

export const columns: ColumnDef<LayoffRow, any>[] = [
  {
    id: 'recorded_on_date',
    accessorFn: (row) => row.asOfDate,
    accessorKey: 'recorded_on_date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Recorded On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{new Date(row.original.asOfDate).toDateString()}</div>
    ),
    sortingFn: 'text',
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'effective_on_date',
    accessorKey: 'effective_on_date',
    header: 'Effective On',
    cell: ({ row }) => (
      <div className="capitalize">
        {new Date(row.original.effectiveOn).toDateString()}
      </div>
    ),
  },
  {
    id: 'company',
    accessorKey: 'company',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    accessorFn: (row) => row.companyName,
    filterFn: 'includesString',
    cell: (info) => <div className="text-right font-medium">{info.getValue()}</div>,
  },
  {
    id: 'num_employees',
    accessorKey: 'num_employees',
    accessorFn: (row) => row.value,
    header: () => <div className="text-right"># Employees</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.original.value.toString()}</div>
    },
  },
  {
    id: 'location',
    accessorKey: 'location',
    accessorFn: (row) => row.locationRaw,
    header: () => <div className="text-right">Location</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.original.locationRaw}</div>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard?.writeText(data.id)}>
              Copy Id
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

type LayoffRow = {
  id: string
  asOfDate: string
  effectiveOn: string
  companyName: string
  companyId: string
  value: number
  locationRaw: string
  locationId: string
}

const mapLayoffToRow = (
  layoffData: ReturnType<typeof useLoaderData<typeof loader>>['layoffs'],
): LayoffRow[] => {
  return layoffData.map((layoff) => ({
    id: layoff.id,
    asOfDate: layoff.asOfDate,
    effectiveOn: layoff.effectiveOn,
    companyName: layoff.company.name,
    companyId: layoff.company.id,
    value: layoff.value,
    locationRaw: layoff.location.raw,
    locationId: layoff.location.id,
  }))
}

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const { layoffs } = useLoaderData<typeof loader>()
  const data = useMemo(() => mapLayoffToRow(layoffs), [layoffs])

  const tableProps = {
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    filterFns: {},
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    debugAll: true,
    debugRows: true,
  }

  const table = useReactTable(tableProps)
  return (
    <div className="w-full">
      <div className="flex w-full justify-between py-4">
        <Input
          placeholder="Filter companies..."
          value={(table.getColumn('company')!.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('company')!.setFilterValue(event.target.value)
          }}
          className="max-w-sm"
        />
        <div>
          <AlertModal
            modalTitle={''}
            buttonTitle={''}
            message={''}
            onClose={function (): void {
              throw new Error('Function not implemented.')
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })
  const layoffs = await new MetricRepository().getMetrics({
    cursor: undefined,
    limit: undefined,
  })

  return json({
    layoffs,
  })
}
