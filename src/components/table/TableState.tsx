import { ReactNode } from "react";
import { SxProps, TableCell, TableRow } from "@mui/material";

type TableStateProps = {
	children: ReactNode;
	colSpan: number;
	sx?: SxProps;
};

const TableState = ({ children, colSpan, sx }: TableStateProps) => {
	return (
		<TableRow>
			<TableCell colSpan={colSpan} align="center" sx={{ fontWeight: "bold", ...sx }}>
				{children}
			</TableCell>
		</TableRow>
	);
};

export default TableState;
