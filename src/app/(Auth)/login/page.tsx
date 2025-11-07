"use client";
import Swal from "sweetalert2";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/schemas/loginSchema";
import { signIn } from "next-auth/react";

import { Grid, Box, Card } from "@mui/material";

import Link from "next/link";
import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import Logo from "@/components/Logo";
import AuthLogin from "./components/AuthLogin";

import { showError } from "@/commons/error";

const Login = () => {
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

	const {
		register: registerLogin,
		handleSubmit: onSubmitLogin,
		formState: { errors: loginErrors },
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
	});

	const handleSubmit = async (data: LoginSchema) => {
		try {
			setLoadingSubmit(true);
	
			const response = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});
	
			if (response?.ok) {
				await Swal.fire({
					timer: 3000,
					title: "Success!",
					text: "Success login",
					icon: "success",
					showConfirmButton: false,
				});
								
				window.location.href = "/dashboard";
			} else {
				throw response?.error;
			}
	
			setLoadingSubmit(false);
		} 
		catch (error) {
			setLoadingSubmit(false);
			showError(error);
		}
	};

	return (
		<PageContainer title="Login" description="this is Login page">
			<Box
				sx={{
					position: "relative",
					"&:before": {
						content: '""',
						background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
						backgroundSize: "400% 400%",
						animation: "gradient 15s ease infinite",
						position: "absolute",
						height: "100%",
						width: "100%",
						opacity: "0.3",
					},
				}}>
				<Grid container spacing={0} sx={{ height: "100vh", justifyContent: "center" }}>
					<Grid
						size={{ xs: 12, sm: 12, lg: 4, xl: 3 }}
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Card elevation={9} sx={{ width: "100%", maxWidth: "500px", zIndex: 1, p: 4 }}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									marginBottom: 2,
								}}>
								<Link href="/" style={{ textDecoration: "none" }}>
									<Logo />
								</Link>
							</Box>
							<AuthLogin								
								subtitle={<></>}
								register={registerLogin}
								errors={loginErrors}
								loadingSubmit={loadingSubmit}
								handleSubmit={handleSubmit}
								onSubmit={onSubmitLogin}
							/>
						</Card>
					</Grid>
				</Grid>
			</Box>
		</PageContainer>
	);
};
export default Login;
