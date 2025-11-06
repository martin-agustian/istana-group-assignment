import { TextField, TextFieldProps } from "@mui/material";

type InputNumberProps = TextFieldProps & {};

const InputNumber = ({ ...rest }: InputNumberProps) => {
  return (
    <TextField 
      fullWidth 
      variant="outlined" 
      size="small"
      slotProps={{
        htmlInput: {
          inputMode: "numeric",
          pattern: '[0-9]*',
        }
      }}
      onKeyDown={(e) => {
        // Blockir non numeric chars
        if (
          !/[0-9]/.test(e.key) &&
          e.key !== 'Backspace' &&
          e.key !== 'Tab' &&
          e.key !== 'ArrowLeft' &&
          e.key !== 'ArrowRight'
        ) {
          e.preventDefault();
        }
      }} {...rest} />
  );
};

export default InputNumber;