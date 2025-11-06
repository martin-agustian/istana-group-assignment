import { uniqueId } from "lodash";
import { IconLayoutDashboard } from "@tabler/icons-react";

export const getMenuItems = () => {
  const menu = [
    {
      navlabel: true,
      subheader: "HOME",
    },
    {
      id: uniqueId(),
      title: "Dashboard",
      icon: IconLayoutDashboard,
      href: "/dashboard"
    },
  ];

  return menu;
};
