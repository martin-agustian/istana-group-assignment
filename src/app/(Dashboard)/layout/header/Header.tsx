import { MouseEvent } from "react";
import PropTypes from "prop-types";

import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge } from "@mui/material";
import { IconMenu, IconShoppingCart } from "@tabler/icons-react";

import Link from "next/link";
import Profile from "./Profile";

interface ItemType {
	toggleMobileSidebar: (event: MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
	// const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
	// const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

	const AppBarStyled = styled(AppBar)(({ theme }) => ({
		boxShadow: "none",
		background: theme.palette.background.paper,
		justifyContent: "center",
		backdropFilter: "blur(4px)",
		[theme.breakpoints.up("lg")]: {
			minHeight: "70px",
		},
	}));
	const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
		width: "100%",
		color: theme.palette.text.secondary,
	}));

	return (
		<AppBarStyled position="sticky" color="default">
			<ToolbarStyled>
				<IconButton
					color="inherit"
					aria-label="menu"
					onClick={toggleMobileSidebar}
					sx={{
						display: {
							lg: "none",
							xs: "inline",
						},
						height: "46px",
						width: "46px",
					}}>
					<IconMenu width="20" height="20" />
				</IconButton>

				<Box flexGrow={1} />

				<Link href="/checkout">
					<IconButton size="large" color="inherit" aria-haspopup="true">
						<IconShoppingCart size="21" stroke="1.5" />
					</IconButton>
				</Link>

				<Stack spacing={1} direction="row" alignItems="center">
					<Profile />
				</Stack>
			</ToolbarStyled>
		</AppBarStyled>
	);
};

Header.propTypes = {
	sx: PropTypes.object,
};

export default Header;
