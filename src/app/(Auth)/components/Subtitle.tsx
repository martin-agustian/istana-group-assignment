import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Link from "next/link";

type SubtitleProps = {
	text: string;
	linkText: string;
	link: string;
};

const Subtitle = ({ text, linkText, link }: SubtitleProps) => {
	return (
		<Stack
			sx={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				gap: 0.5,
				marginTop: 3,
			}}>
			<Typography variant="subtitle1" color="textSecondary" sx={{ fontWeight: 500 }}>
				{text}
			</Typography>
			<Typography
				href={link}
				component={Link}
				variant="subtitle1"
				sx={{
					fontWeight: 500,
					textDecoration: "none",
					color: "primary.main",
				}}>
				{linkText}
			</Typography>
		</Stack>
	);
};

export default Subtitle;
