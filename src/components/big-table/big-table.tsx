import {
  useReactTable,
  getCoreRowModel,
  type CellContext,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { createArray } from "~/lib/utils";
import { type Item } from "~/types/item";
import { Button } from "~/components/ui/button";
import { DataTable } from "../ui/data-table";
import { Input } from "~/components/ui/input";
import { makeRows } from "./utils";
import { Combobox } from "../combobox";
import {
  BigTableContextProvider,
  useBigTableContext,
} from "./big-table-context";
import { type BigTableRow } from "./types";
import { isEqual } from "radash";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (
      rowIndex: number,
      columnId: string,
      value: Item | null,
    ) => void;
  }
}

const Cell = (props: CellContext<BigTableRow, Item | null>) => {
  const currentColumnId = props.column.id;
  const previousColumnId =
    currentColumnId === "1" ? null : (Number(currentColumnId) - 1).toString();

  const currentColumnValue = props.cell.getValue();

  const { comboboxOptions, addItem } = useBigTableContext();

  if (previousColumnId === null) {
    const onChange = (val: string) => {
      const value: Item | null =
        val === "" ? null : { id: val, parentId: null };
      props.table.options.meta?.updateData(
        props.row.index,
        currentColumnId,
        value,
      );
    };
    return (
      <Combobox
        value={currentColumnValue?.id ?? ""}
        parentId={null}
        options={comboboxOptions}
        onChange={onChange}
        addLevel={addItem}
      />
    );
  }

  const previousColumnValue = props.row.getValue<Item | null>(previousColumnId);

  if (previousColumnValue === undefined) {
    throw new Error("Should never happen! Check previousColumnId");
  }

  if (previousColumnValue === null) {
    return null;
  }

  const onChange = (val: string) => {
    const item: Item | null =
      val === "" ? null : { id: val, parentId: previousColumnValue.id };
    props.table.options.meta?.updateData(
      props.row.index,
      currentColumnId,
      item,
    );
  };

  return (
    <Combobox
      value={currentColumnValue?.id ?? ""}
      parentId={previousColumnValue.id}
      options={comboboxOptions}
      onChange={onChange}
      addLevel={addItem}
    />
  );
};

const columns: ColumnDef<BigTableRow, Item | null>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "1",
    header: "Level 1",
    cell: Cell,
    size: 240,
  },
  {
    accessorKey: "2",
    header: "Level 2",
    cell: Cell,
    size: 240,
    meta: {},
  },
  {
    accessorKey: "3",
    header: "Level 3",
    cell: Cell,
    size: 240,
  },
  {
    accessorKey: "4",
    header: "Level 4",
    cell: Cell,
    size: 240,
  },
  {
    accessorKey: "5",
    header: "Level 5",
    cell: Cell,
    size: 240,
  },
  {
    accessorKey: "6",
    header: "Level 6",
    cell: Cell,
    size: 240,
  },
];

type Id = number;

export const BigTable = () => {
  const [tableData, setTableData] = useState<BigTableRow[]>(makeRows(40, 1));
  const [rowsCount, setRowsCounts] = useState("");

  const touchedFields = useMemo(() => {
    return new Map<
      Id,
      { initialState: BigTableRow; currentState: BigTableRow }
    >();
  }, []);

  const handleRowsCountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsCounts(event.target.value.replace(/\D/, ""));
  };

  const handleAddRowsClick = () => {
    const count = Number(rowsCount);
    const lastIndex = Number(tableData[tableData.length - 1]!.id);
    const newRows = makeRows(count, lastIndex + 1);
    setRowsCounts("");
    setTableData((d) => [...d, ...newRows]);
  };

  const handleSaveClick = () => {
    const updatedFields = Array.from(touchedFields.entries())
      .filter(([_, { initialState, currentState }]) => {
        return !isEqual(initialState, currentState);
      })
      .map(([id, state]) => ({ id, state }));

    console.group("Updated fields");
    console.log(updatedFields);
    console.groupEnd();

    touchedFields.clear();
  };

  const maxLevel = 6;

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, item: Item | null) => {
        if (columnId === "id") {
          return;
        }

        const row = tableData[rowIndex];

        if (!row) {
          console.error("Trying to update row with index", rowIndex);
          return;
        }

        const id = row.id;

        if (!touchedFields.has(id)) {
          touchedFields.set(id, {
            initialState: { ...row },
            currentState: { ...row },
          });
        }

        setTableData((old) =>
          old.map((row, index) => {
            const level = Number(columnId);

            if (index === rowIndex) {
              const levelsToReset = createArray({
                min: level + 1,
                max: maxLevel,
              });

              const updatedRow = {
                ...row,
                [columnId]: item,
              };

              const result = levelsToReset.reduce((acc, levelToReset) => {
                acc[levelToReset as keyof Omit<typeof acc, "id">] = null;
                return acc;
              }, updatedRow);

              const field = touchedFields.get(id);

              if (!field) {
                console.error("Something went wrong...");
              } else {
                touchedFields.set(id, {
                  ...field,
                  currentState: { ...result },
                });
              }

              return result;
            }

            return row;
          }),
        );
      },
    },
  });

  return (
    <div className="flex w-full flex-col gap-2">
      <BigTableContextProvider>
        <DataTable table={table} />
      </BigTableContextProvider>

      <div className="item-row flex gap-2 self-start">
        <Button variant={"secondary"} onClick={handleAddRowsClick}>
          + Add rows
        </Button>
        <Input
          type="text"
          value={rowsCount}
          onChange={handleRowsCountChange}
          placeholder="Number of rows to add..."
        />
      </div>
      <div className="self-start">
        <Button onClick={handleSaveClick}>Save</Button>
      </div>
    </div>
  );
};
