import { ReactNode } from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import DashboardCardTitle from "./DashboardCardTitle";

type Props = {
	title?: string;
	titleNode?: ReactNode;
	subtitle?: string;
	action?: ReactNode | any;
	footer?: ReactNode;
	cardheading?: string | ReactNode;
	headtitle?: string | ReactNode;
	headsubtitle?: string | ReactNode;
	children?: ReactNode;
	middlecontent?: string | ReactNode;
};

const DashboardCard = ({ title, titleNode, subtitle, children, action, footer, cardheading, headtitle, headsubtitle, middlecontent }: Props) => {
	return (
		<Card sx={{ padding: 0 }} elevation={9} variant={undefined}>
			{cardheading ? (
				<CardContent>
					<Typography variant="h5">{headtitle}</Typography>
					<Typography variant="subtitle2" color="textSecondary">
						{headsubtitle}
					</Typography>
				</CardContent>
			) : (
				<CardContent sx={{ p: "30px" }}>
					{title || titleNode ? (
						<Stack
							direction="row"
							spacing={2}
							sx={{
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: 3,
							}}>
							<Box>
								{title ? <DashboardCardTitle>{title}</DashboardCardTitle> : ""}
								{titleNode}

								{subtitle ? (
									<Typography variant="subtitle2" color="textSecondary">
										{subtitle}
									</Typography>
								) : (
									""
								)}
							</Box>
							{action}
						</Stack>
					) : null}

					{children}
				</CardContent>
			)}

			{middlecontent}
			{footer}
		</Card>
	);
};

export default DashboardCard;
