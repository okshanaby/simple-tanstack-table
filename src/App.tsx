import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingFn,
  type SortingState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import data from "./data.json";

type Person = {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
};

// //custom sorting logic for one of our enum columns
const sortStatusFn: SortingFn<Person> = (rowA, rowB) => {
  const statusA = rowA.original.status;
  const statusB = rowB.original.status;
  const statusOrder = ["single", "complicated", "relationship"];
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
};

const columnHelper = createColumnHelper<Person>();
const columns = [
  columnHelper.accessor("id", {
    header: "ID", // header column label
    cell: info => info.getValue(), // row cell - value
    //this column will sort in descending order by default since it is a number column
  }),
  columnHelper.accessor("name", {
    header: () => "NAME",
    //this column will sort in ascending order by default since it is a string column
  }),
  columnHelper.accessor("phone", {
    header: () => <span className="underline">PHONE</span>,
    cell: info => (
      <span className="italic underline cursor-pointer">{info.getValue()}</span>
    ),
    sortUndefined: "last", //force undefined values to the end
  }),
  columnHelper.accessor("email", {
    header: "EMAIL",
    // enableSorting: false, //disable sorting for this column
  }),
  columnHelper.accessor("status", {
    header: "STATUS",
    sortingFn: sortStatusFn, //use our custom sorting function for this enum column
  }),
];

function App() {
  const tableData: Person[] = useMemo(() => data, []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const {
    getHeaderGroups,
    getRowModel,
    getState,
    setPageSize,
    getPageCount,
    setPageIndex,
    nextPage,
    getCanNextPage,
    firstPage,
    previousPage,
    lastPage,
    getCanPreviousPage,
  } = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting, globalFilter },
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    // sortingFns: {
    //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
    // },
    // onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 2,
      },
    },
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="max-w-3xl mx-auto bg-white rounded-md shadow-sm overflow-hidden">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <p className="mt-3 text-gray-600 text-sm">
            Searching for:{" "}
            <span className="font-medium">{globalFilter || "nothing yet"}</span>
          </p>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            {getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    <div
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {/* show arrow  */}
                      {header.column.getIsSorted() === "asc" && " 🔼"}
                      {header.column.getIsSorted() === "desc" && " 🔽"}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2">Items per page</span>
            <select
              className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              value={getState().pagination.pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[2, 5, 10, 20, 30].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => firstPage()}
              disabled={!getCanPreviousPage()}
            >
              <ChevronsLeft size={20} />
            </button>

            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => previousPage()}
              disabled={!getCanPreviousPage()}
            >
              <ChevronLeft size={20} />
            </button>

            <span className="flex items-center">
              <input
                min={1}
                max={getPageCount()}
                type="number"
                value={getState().pagination.pageIndex + 1}
                readOnly
                onChange={e => {
                  let page = 0;
                  const value = Number(e.target.value);

                  if (value && value <= getPageCount()) {
                    page = Number(e.target.value) - 1;
                  }

                  setPageIndex(page);
                }}
                className="w-16 p-2 rounded-md border border-gray-300 text-center"
              />
              <span className="ml-1">of {getPageCount()}</span>
            </span>

            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => nextPage()}
              disabled={!getCanNextPage()}
            >
              <ChevronRight size={20} />
            </button>

            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => lastPage()}
              disabled={!getCanNextPage()}
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
