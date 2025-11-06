import { ComponentProps, ReactNode } from "react";
import { Box, Typography, TypographyTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type TypographyComponent = OverridableComponent<TypographyTypeMap<{}, "label">>;
type TypographyProps = ComponentProps<TypographyComponent>;

type LabelProps = TypographyProps & {
  children: ReactNode;
};

const Label = ({ children, sx, ...rest }: LabelProps) => {
  return (
    <Box sx={{ marginBottom: 0.5 }}>
      <Typography 
        component="label"
        variant="subtitle1"
        sx={{ fontWeight: 600, ...sx }}
        {...rest}
      >
        {children} 
      </Typography>
    </Box>
  )
}

export default Label;