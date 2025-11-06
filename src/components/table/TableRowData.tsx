import { ReactNode } from "react";
import { TableRow, TableRowProps } from "@mui/material";

type TableRowDataProps = TableRowProps & {
  children: ReactNode;
};

const TableRowData = ({ children, sx, ...rest }: TableRowDataProps) => {
  return (
    <TableRow sx={{ cursor: "pointer", ":hover": { background: "#DFE5EF" }, ...sx }} {...rest}>
      {children}
    </TableRow>
  );
};

export default TableRowData;