import { ReactNode } from "react";
import { Typography } from "@mui/material";

const DashboardCardTitle = ({ children }: { children?: ReactNode }) => {
	return <Typography variant="h5">{children}</Typography>;
};

export default DashboardCardTitle;
