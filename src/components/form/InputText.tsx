import { TextField, TextFieldProps } from "@mui/material";

type InputTextProps = TextFieldProps & {};

const InputText = ({ ...rest }: InputTextProps) => {
	return <TextField fullWidth variant="outlined" size="small" {...rest} />;
};

export default InputText;
