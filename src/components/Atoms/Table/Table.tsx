import { DetailedHTMLProps, TdHTMLAttributes, ThHTMLAttributes } from "react";

export const TableHeader = (
  props: DetailedHTMLProps<
    ThHTMLAttributes<HTMLTableHeaderCellElement>,
    HTMLTableHeaderCellElement
  >,
) => {
  return <th className="border border-primary bg-gray-100 p-2" {...props}></th>;
};

export const TableCell = (
  props: DetailedHTMLProps<
    TdHTMLAttributes<HTMLTableDataCellElement>,
    HTMLTableDataCellElement
  >,
) => {
  return <td className="p-2 border border-primary" {...props}></td>;
};
