import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { type ComboboxOptions } from "../combobox";
import { type Item } from "~/types/item";

const initialItems: Item[] = [
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

const mapItemsToComboboxOptions = (items: Item[]): ComboboxOptions => {
  return items.reduce((acc, { id, parentId }) => {
    const key = parentId ?? "none";
    if (acc[key]) {
      acc[key]!.push({ id });
    } else {
      acc[key] = [{ id }];
    }
    return acc;
  }, {} as ComboboxOptions);
};

type BigTableContextType = {
  comboboxOptions: ComboboxOptions;
  addItem: (item: Item) => void;
};

const BigTableContext = createContext<BigTableContextType | null>(null);

export const useBigTableContext = () => {
  const context = useContext(BigTableContext);

  if (!context) {
    throw new Error(
      "useBigTableContext must be used inside children of BigTableContextProvider",
    );
  }

  return context;
};

export const BigTableContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [items, setItems] = useState<Item[]>(initialItems);

  const options = useMemo(() => {
    return mapItemsToComboboxOptions(items);
  }, [items]);

  const addItem = useCallback((item: Item) => {
    setItems((is) => [...is, item]);
  }, []);

  const value: BigTableContextType = useMemo(
    () => ({
      comboboxOptions: options,
      addItem,
    }),
    [options, addItem],
  );

  return (
    <BigTableContext.Provider value={value}>
      {children}
    </BigTableContext.Provider>
  );
};
