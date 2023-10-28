import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
  addOption?: (option: { id: string; parentId: string | null }) => void;
  onChange: (value: string) => void;
  value: string;
};

export function Combobox({
  parentId,
  options: _allOptions,
  onChange,
  value,
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
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
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
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
