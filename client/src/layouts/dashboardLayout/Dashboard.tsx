import { Box, CssBaseline } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

interface DashboardNavProps {
  type: string;
}

const Dashboardnav: React.FC<DashboardNavProps> = ({ type }) => {
  const [rightDrawer, setRightDrawer] = useState<boolean>(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
        }}
      >
        <CssBaseline />
        <Header setRightDrawer={setRightDrawer} rightDrawer={rightDrawer} />
        <Box
          component="main"
          className="mx-1 px-2 pb-2 scroll"
          sx={{
            flexGrow: { md: rightDrawer ? 0 : 1, xs: 1 },
            width: {
              md: `calc(100% - ${250 + (rightDrawer ? 238 : 0)}px)`,
            },
            overflow: "auto",
            marginTop: "74px",
          }}
        >
          <Outlet context={{ type }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboardnav;
