"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import CssBaseline from "@mui/material/CssBaseline";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<SessionProvider>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<ThemeProvider theme={baselightTheme}>
							{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
							<CssBaseline />
							{children}
						</ThemeProvider>
					</LocalizationProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
