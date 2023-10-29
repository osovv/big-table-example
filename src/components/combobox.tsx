import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCommandState } from "cmdk";

export type ComboboxOptionItem = {
  id: string;
};

export type ComboboxOptions = {
  none: ComboboxOptionItem[];
  [id: string]: ComboboxOptionItem[];
};

type ComboboxProps = {
  options: ComboboxOptions;
  parentId: string | null;
  addLevel: (level: { id: string; parentId: string | null }) => void;
  onChange: (value: string) => void;
  value: string;
};

type SearchEmptyProps = {
  addLevel: ComboboxProps["addLevel"];
  onChange: ComboboxProps["onChange"];
  parentId: ComboboxProps["parentId"];
};

const SearchEmpty = ({ addLevel, onChange, parentId }: SearchEmptyProps) => {
  const search = useCommandState((state) => state.search);

  return (
    <Button
      onClick={() => {
        onChange(search);
        addLevel({ id: search, parentId });
      }}
    >
      + Add option
    </Button>
  );
};

export function Combobox({
  parentId,
  options: _allOptions,
  onChange,
  value,
  addLevel,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const options = React.useMemo(() => {
    return _allOptions[parentId ?? "none"] ?? [];
  }, [parentId, _allOptions]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find((option) => option.id === value)?.id
            : "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search option..." />
          <CommandEmpty>
            <SearchEmpty
              parentId={parentId}
              addLevel={addLevel}
              onChange={onChange}
            />
          </CommandEmpty>
          <CommandGroup>
            {options?.map((option) =>
              option ? (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={(currentValue) => {
                    const res = currentValue === value ? "" : currentValue;
                    onChange(res);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.id}
                </CommandItem>
              ) : null,
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
