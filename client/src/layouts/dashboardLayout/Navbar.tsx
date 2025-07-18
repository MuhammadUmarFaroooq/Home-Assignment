import React from "react";
import { AppBar, IconButton, Toolbar, Box, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation } from "react-router-dom";
import { getTitleFromPathname } from "../../utils/GetTitleFromPathname";
import profile from "/images/profile.jpg";
import { MdCircleNotifications } from "react-icons/md";
import { useSelector } from "react-redux";

interface NavbarProps {
  handleDrawerToggle: () => void;
  rightDrawer: boolean;
}

interface UserData {
  name?: string;
  role?: string;
  // Add other user properties as needed
}

const Navbar: React.FC<NavbarProps> = ({ handleDrawerToggle, rightDrawer }) => {
  const { pathname } = useLocation();
  const title = getTitleFromPathname(pathname);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up(900));
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "red", boxShadow: "none" }}
      >
        <Toolbar disableGutters>
          <Box
            className={`flex px-4 items-center justify-between w-full py-3 bg-white ${
              isSmall ? "ml-[240px]" : "ml-0"
            } ${isSmall && rightDrawer ? "mr-[240px]" : "mr-0"}`}
          >
            <Box className="hidden sm:flex justify-start items-center">
              <h5 className="my-0 mx-3 text-blue-500 font-bold text-dark text-nowrap capitalize">
                {title}
              </h5>
            </Box>
            <Box className="flex items-center justify-end sm:justify-between w-full text-dark gap-3">
              <Box className="flex items-center justify-end gap-2 w-full text-black">
                <Box className="flex items-center space-x-3">
                  <Avatar
                    sx={{
                      bgcolor: "skyblue",
                      width: 40,
                      height: 40,
                      fontSize: 14,
                    }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                  <Box className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </Box>
                </Box>
              </Box>

              <Box className="md:hidden">
                <IconButton onClick={handleDrawerToggle}>
                  <MenuIcon className="text-black" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
