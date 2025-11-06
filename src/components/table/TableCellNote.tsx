import { ReactNode } from "react";
import { TableCell, TableCellProps } from "@mui/material";

type TableRowDataProps = TableCellProps & {
  children: ReactNode;
};

const TableCellNote = ({ children, sx, ...rest }: TableRowDataProps) => {
  return (
    <TableCell sx={{ maxWidth: "300px", ...sx }} {...rest}>
      {children}
    </TableCell>
  );
};

export default TableCellNote;