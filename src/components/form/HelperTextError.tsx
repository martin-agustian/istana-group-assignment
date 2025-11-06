import { ReactNode } from "react";
import { Typography } from "@mui/material";
import { SxProps, TypographyProps } from "@mui/system";

type HelperTextErrorProps = TypographyProps & {
	children: ReactNode;
	sx?: SxProps;
};

const HelperTextError = ({ children, sx, ...rest }: HelperTextErrorProps) => {
	return (
		<Typography variant="caption" color="error" sx={{ marginTop: "5px", ...sx }} {...rest}>
			{children}
		</Typography>
	);
};

export default HelperTextError;
