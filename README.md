# Techical Task

## Goal

1. A table that contains 6 columns:

- 1st column: Row sequence number
- 2nd - 6th column: Nesting Level (from 1 to 5).

2. Table cell with Nesting Level is a Select with search:

   Example data for allOptions:

```js
[
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
```

Options in select should be filtered based on the selected value in the previous cell in this row (for Level 1 - parentId: null)
If the search in select does not find an Option - the Add button is displayed. Add Option is added with a binding to the value in the previous cell in this row (id: searchQuery, parentId: parentValue)
When changing the value in a cell - all the following values in this row should be reset.

3. Under the table there is a Text field + Add row button.
   By clicking on the Add Row button, rows are added to the table in the number of rows specified in the Text field.
   When adding 100000+ rows the form should not hang - you should take this into account when writing the code

4. Save button - by clicking it, the selected values in the form are dumped to the console.

You can use any React libraries for development

Styles for the form any/no styles

+TypeScript
