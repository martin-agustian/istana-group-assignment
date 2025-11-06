import { usePathname } from "next/navigation";

import Link from "next/link";
import Logo from "@/components/Logo";

import { Box } from "@mui/material";
import { Sidebar as SidebarMUI, Menu, MenuItem, Submenu } from "react-mui-sidebar";
import { IconPoint } from "@tabler/icons-react";

import { getMenuItems } from "./MenuItems";

const renderMenuItems = (items: any, pathDirect: any) => {
	return items.map((item: any) => {
		const Icon = item.icon ? item.icon : IconPoint;

		const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

		if (item.subheader) {
			// Display Subheader
			return <Menu subHeading={item.subheader} key={item.subheader} />;
		}

		//If the item has children (submenu)
		if (item.children) {
			return (
				<Submenu key={item.id} title={item.title} icon={itemIcon} borderRadius="7px">
					{renderMenuItems(item.children, pathDirect)}
				</Submenu>
			);
		}

		// If the item has no children, render a MenuItem

		return (
			<Box px={3} key={item.id}>
				<MenuItem key={item.id} isSelected={pathDirect === item?.href} borderRadius="8px" icon={itemIcon} link={item.href} component={Link}>
					{item.title}
				</MenuItem>
			</Box>
		);
	});
};

const SidebarItems = () => {
	const pathname = usePathname();
	const pathDirect = pathname;

	return (
		<>
			<SidebarMUI width={"100%"} showProfile={false} themeColor={"#5D87FF"} themeSecondaryColor={"#49beff"}>
				<Box p={3}>
					<Link href="/" style={{ textDecoration: "none" }}>
						<Logo sxText={{ display: "inline" }} />
					</Link>
				</Box>

				{renderMenuItems(getMenuItems(), pathDirect)}
			</SidebarMUI>
		</>
	);
};
export default SidebarItems;
