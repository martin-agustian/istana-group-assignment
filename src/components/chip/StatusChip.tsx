import { Chip, SxProps } from "@mui/material";

type StatusChipProps = {
  status?: string;
  sx?: SxProps;
};

const StatusChip = ({ status, sx }: StatusChipProps) => {
	return (
    <Chip 
      label={status} 
      color={"default"} 
      component="span" 
      size="small" 
      sx={{ 
        fontSize: "12px", 
        fontWeight: "bold",
        ...sx
      }} 
    />
  );
};

export default StatusChip;
