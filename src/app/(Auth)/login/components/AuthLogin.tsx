import { ReactNode } from "react";

import { Box, Typography, Button, Stack } from "@mui/material";

import InputText from "@/components/form/InputText";

import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { LoginSchema } from "@/schemas/loginSchema";

type AuthLoginProps = {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
  register: UseFormRegister<LoginSchema>;
  errors?: FieldErrors<LoginSchema>;
  loadingSubmit: boolean;
  onSubmit: UseFormHandleSubmit<LoginSchema>;
  handleSubmit: (data: LoginSchema) => Promise<void>;  
}

const AuthLogin = ({ title, subtitle, subtext, register, errors, loadingSubmit, handleSubmit, onSubmit }: AuthLoginProps) => (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <form onSubmit={onSubmit(handleSubmit)}>
      <Stack>
        <Box>
          <Typography
            htmlFor="email"
            component="label"
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              marginBottom: "5px",
            }}
          >
            Email
          </Typography>
          
          <InputText id="email" fullWidth variant="outlined" size="small" placeholder="Enter Email" {...register("email")} />
          
          {errors?.email?.message && (
            <Typography variant="caption" color="error" sx={{ marginTop: "5px" }}>
              {errors.email.message}
            </Typography>
          )}
        </Box>
        <Box sx={{ marginTop: "15px" }}>
          <Typography
            htmlFor="password"
            component="label"
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              marginBottom: "5px",
            }}
          >
            Password
          </Typography>
          
          <InputText
            id="password" 
            fullWidth 
            type="password" 
            variant="outlined" 
            size="small"
            placeholder="Enter Password"
            {...register("password")} 
          />

          {errors?.password?.message && (
            <Typography variant="caption" color="error" sx={{ marginTop: "5px" }}>
              {errors.password.message}
            </Typography>
          )}
        </Box>
      </Stack>
      <Box sx={{ marginTop: "25px" }}>
        <Button
          fullWidth
          type="submit"
          color="primary"
          variant="contained"
          size="medium"
          loading={loadingSubmit}
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase"
          }}
        >
          Sign In
        </Button>
      </Box>
    </form>
    {subtitle}
  </>
);

export default AuthLogin;
