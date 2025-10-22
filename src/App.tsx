import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import data from "./data.json";

type Person = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

const columnHelper = createColumnHelper<Person>();
const columns = [
  columnHelper.accessor("id", {
    header: "ID", // header column label
  }),
  columnHelper.accessor("name", {
    header: () => "NAME",
  }),
  columnHelper.accessor("phone", {
    header: () => <span className="underline">PHONE</span>,
  }),
  columnHelper.accessor("email", {
    header: "EMAIL",
  }),
];

function App() {
  const tableData = useMemo(() => data, []);

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log("🚀 ~ App ~ getRowModel:", getRowModel());

  return (
    <>
      <div className="max-w-3xl mx-auto bg-white rounded-md shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            {getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        </table>
      </div>
    </>
  );
}

export default App;
