import {
  createColumnHelper,
  type ColumnDef,
  type CellContext,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import Head from "next/head";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Combobox, type ComboboxOptions } from "~/components/combobox";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Input } from "~/components/ui/input";

type Level = {
  id: string;
  parentId: string | null;
};

type Item = {
  id: number;
  1: Level | null;
  2: Level | null;
  3: Level | null;
  4: Level | null;
  5: Level | null;
  6: Level | null;
};

const initialLevels: Level[] = [
  {
    id: "1.1",
    parentId: null,
  },
  {
    id: "1.2",
    parentId: null,
  },
  {
    id: "2.1",
    parentId: "1.1",
  },
  {
    id: "2.2",
    parentId: "1.2",
  },
  {
    id: "3.1",
    parentId: "2.1",
  },
  {
    id: "3.2",
    parentId: "2.2",
  },
  {
    id: "4.1",
    parentId: "3.1",
  },
  {
    id: "4.2",
    parentId: "3.2",
  },
  {
    id: "5.1",
    parentId: "4.1",
  },
  {
    id: "5.2",
    parentId: "4.2",
  },
];

const mapLevelsToComboboxOptions = (levels: Level[]): ComboboxOptions => {
  return levels.reduce((acc, { id, parentId }) => {
    const key = parentId ?? "none";
    if (acc[key]) {
      acc[key]!.push({ id });
    } else {
      acc[key] = [{ id }];
    }
    return acc;
  }, {} as ComboboxOptions);
};

type ComboboxOptionsContextType = {
  options: ComboboxOptions;
  addLevel: (level: Level) => void;
};

const ComboboxOptionsContext = createContext<ComboboxOptionsContextType | null>(
  null,
);

const useComboboxOptionsContext = () => {
  const context = useContext(ComboboxOptionsContext);

  if (!context) {
    throw new Error(
      "useComboboxOptionsContext must be used inside children of ComboboxOptionsContextProvider",
    );
  }

  return context;
};

const ComboboxOptionsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [levels, setLevels] = useState<Level[]>(initialLevels);

  const options = useMemo(() => {
    return mapLevelsToComboboxOptions(levels);
  }, [levels]);

  const addLevel = useCallback((level: Level) => {
    setLevels((ls) => [...ls, level]);
  }, []);

  const value = useMemo(
    () => ({
      options,
      addLevel,
    }),
    [options, addLevel],
  );

  return (
    <ComboboxOptionsContext.Provider value={value}>
      {children}
    </ComboboxOptionsContext.Provider>
  );
};

const Cell = (props: CellContext<Item, unknown>) => {
  const currentColumnId = props.column.id;
  const previousColumnId =
    currentColumnId === "1" ? null : (Number(currentColumnId) - 1).toString();

  const currentColumnValue = props.cell.getValue();

  const { options, addLevel } = useComboboxOptionsContext();

  if (previousColumnId === null) {
    const onChange = (val: string) => {
      const value: Level | null =
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
        options={options}
        onChange={onChange}
        addLevel={addLevel}
      />
    );
  }

  const previousColumnValue = props.row.getValue(previousColumnId);

  if (previousColumnValue === null) {
    return null;
  }

  const onChange = (val: string) => {
    const value: Level | null =
      val === "" ? null : { id: val, parentId: previousColumnValue.id };
    props.table.options.meta?.updateData(
      props.row.index,
      currentColumnId,
      value,
    );
  };

  return (
    <Combobox
      value={currentColumnValue?.id ?? ""}
      parentId={previousColumnValue.id}
      options={options}
      onChange={onChange}
      addLevel={addLevel}
    />
  );
};

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "id",
    header: "№",
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

const makeData = (len: number, startingIndex: number): Item[] => {
  return Array.from(Array(len), (_, i) => ({
    id: startingIndex + i,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  }));
};

const createArray = ({ min, max }: { min: number; max: number }) => {
  return Array.from(Array(max + 1 - min)).map(function (_, idx) {
    return idx + min;
  });
};

export default function Home() {
  const [tableData, setTableData] = useState<Item[]>(makeData(40, 1));
  const [rowsCount, setRowsCounts] = useState("");

  const handleRowsCountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsCounts(event.target.value.replace(/\D/, ""));
  };

  const handleAddRowsClick = () => {
    const count = Number(rowsCount);
    const lastIndex = tableData[tableData.length - 1]!.id;
    const newRows = makeData(count, lastIndex + 1);
    setRowsCounts("");
    setTableData((d) => [...d, ...newRows]);
    console.log(`Add ${count} rows`);
  };

  const handleSaveClick = () => {
    console.log("Save");
  };

  const maxLevel = 6;

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: Level | null) => {
        if (columnId === "id") {
          return;
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
                [columnId]: value,
              };

              const result = levelsToReset.reduce((acc, levelToReset) => {
                acc[levelToReset as keyof Omit<typeof acc, "id">] = null;
                return acc;
              }, updatedRow);

              return result;
            }

            return row;
          }),
        );
      },
    },
  });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex min-h-screen flex-col items-center justify-center gap-2">
        <ComboboxOptionsContextProvider>
          <DataTable table={table} />
        </ComboboxOptionsContextProvider>

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
      </main>
    </>
  );
}
