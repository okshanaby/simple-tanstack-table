import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingFn,
  type SortingState,
} from "@tanstack/react-table";
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

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting, globalFilter },
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    // sortingFns: {
    //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
    // },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  console.log("🚀 ~ App ~ getRowModel:", getRowModel());

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
      </div>
    </>
  );
}

export default App;
