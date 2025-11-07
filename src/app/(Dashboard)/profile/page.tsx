"use client";
import { useSession } from "next-auth/react";

import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/card/DashboardCard";

import { Stack } from "@mui/system";
import { Avatar, Typography } from "@mui/material";

const Profile = () => {
  const { data: session } = useSession();

  return (
    <PageContainer title="My Profile" description="my profile">
      <DashboardCard title="My Profile">
        <Stack 
          direction={{ sx: "column", md: "row" }}
          gap={{ xs: 3, md: 8 }}
          alignItems="center"
        >
          <Avatar
            src="/profile.jpg"
            alt="image"
            sx={{
              width: 150,
              height: 150,
            }}
          />
          <Stack gap={2} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="body1" sx={{ color: "primary.main", fontSize: "40px", fontWeight: "bold",  mt: 0.5 }}>
              {session?.user?.name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              {session?.user?.email}
            </Typography>
          </Stack>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default Profile;
