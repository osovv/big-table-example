import { type ColumnDef } from "@tanstack/react-table";
import Head from "next/head";
import { DataTable } from "~/components/ui/data-table";

type Level = {
  id: string;
  parentId: string | null;
};

type Item = {
  id: number;
  level1: Level | null;
  level2: Level | null;
  level3: Level | null;
  level4: Level | null;
  level5: Level | null;
  level6: Level | null;
};

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "id",
    header: "№",
  },
  {
    accessorKey: "level1",
    header: "Level 1",
  },
  {
    accessorKey: "level2",
    header: "Level 2",
  },
  {
    accessorKey: "level3",
    header: "Level 3",
  },
  {
    accessorKey: "level4",
    header: "Level 4",
  },
  {
    accessorKey: "level5",
    header: "Level 5",
  },
  {
    accessorKey: "level6",
    header: "Level 6",
  },
];

const data: Item[] = [
  {
    id: 1,
    level1: null,
    level2: null,
    level3: null,
    level4: null,
    level5: null,
    level6: null,
  },
  {
    id: 2,
    level1: null,
    level2: null,
    level3: null,
    level4: null,
    level5: null,
    level6: null,
  },
  {
    id: 3,
    level1: null,
    level2: null,
    level3: null,
    level4: null,
    level5: null,
    level6: null,
  },
  {
    id: 4,
    level1: null,
    level2: null,
    level3: null,
    level4: null,
    level5: null,
    level6: null,
  },
  {
    id: 5,
    level1: null,
    level2: null,
    level3: null,
    level4: null,
    level5: null,
    level6: null,
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex min-h-screen flex-col items-center justify-center">
        <DataTable data={data} columns={columns} />
      </main>
    </>
  );
}
