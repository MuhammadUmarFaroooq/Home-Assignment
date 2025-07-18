import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  activelistItemStyle,
  buttonStyle,
  listItemStyle,
} from "./SideNavStyles";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { LiaHotelSolid } from "react-icons/lia";
import { AiOutlineAppstore } from "react-icons/ai";
import { LuCalendar, LuUsers, LuUser } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import {
  TbEaseInOutControlPoints,
  TbLogout,
  TbReport,
  TbUserDollar,
} from "react-icons/tb";
import { IoCalendar } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { CiLogout, CiWallet } from "react-icons/ci";
import { HiOutlineLogout } from "react-icons/hi";
import { GoWorkflow } from "react-icons/go";
import { FaCreditCard } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { PiUsersThreeLight } from "react-icons/pi";
import logoutIcon from "/images/logoutIcon.png";
import ReusableModal from "../../components/modals/ReuseableModal";
import { useDispatch } from "react-redux";
import { persistor } from "../../redux/store.js";
import { apiSlice } from "../../api/apiSlice.js";
import { logout } from "../../redux/authSlice.js";

interface SideNavProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  window?: () => Window;
}

interface RouteItem {
  label: string;
  link: string;
  icon: React.ReactNode;
}

const drawerWidth = 240;

const sideroutes: RouteItem[] = [
  {
    label: "Task Dashboard",
    link: `/task-dashboard`,
    icon: <AiOutlineAppstore style={{ fontSize: "20px" }} />,
  },
];

interface RenderItemProps {
  value: RouteItem;
  i: number;
}

const RenderItem: React.FC<RenderItemProps> = ({ value, i }) => {
  const location = useLocation();

  const cleanLink = value.link.startsWith("/")
    ? value.link.slice(1)
    : value.link;
  const isActive = location.pathname.includes(cleanLink);

  return value.link ? (
    <ListItem
      key={i}
      component={NavLink}
      to={value?.link || ""}
      disablePadding
      sx={[listItemStyle, isActive && activelistItemStyle]}
      className={({ isActive }: { isActive: boolean }) =>
        `rounded-pill ${isActive ? "active-tab" : ""}`
      }
    >
      <ListItemButton className="list-item list_text " sx={{ ...buttonStyle }}>
        <ListItemIcon
          className="myIconClass"
          sx={{ color: "black", marginRight: -3 }}
        >
          {value.icon}
        </ListItemIcon>
        <ListItemText
          className=""
          primary={
            <Typography
              variant="body2"
              style={{ fontSize: 14, paddingLeft: 0, whiteSpace: "nowrap" }}
              title={value.label}
            >
              {value.label}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  ) : (
    <ListItemButton
      sx={{
        ...buttonStyle,
        border: "1px solid #FBBC05",
        "&:hover": { backgroundColor: "#04BCFA" },
      }}
    >
      <ListItemText
        className=""
        primary={
          <Typography
            variant="body2"
            style={{ fontSize: 14, color: "#000", fontWeight: "bold" }}
            title={value.label}
          >
            {value.label}
          </Typography>
        }
      />
    </ListItemButton>
  );
};

const SideNav: React.FC<SideNavProps> = (props) => {
  const { window, mobileOpen, handleDrawerToggle } = props;
  const navigate = useNavigate();
  const [logOut, setLogOut] = useState(false);
  const userRoutes = sideroutes;
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    persistor.purge();
    apiSlice.util.resetApiState();
    navigate("/");
  };

  const drawer = (
    <div
      className="bg-white border border-start-0 border-top-0 border-bottom-0 border-gray-300"
      style={{
        boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.1)",
        height: "100vh",
      }}
    >
      <div
        className="px-3"
        style={{ backgroundColor: "white", borderRadius: "15px" }}
      >
        <div className="">
          <div className="p-4 flex justify-center" style={{ width: "100%" }}>
            <h3 className="text-2xl font-bold">LOGO</h3>
          </div>
          <List
            className="pe-2"
            style={{ height: "calc(100vh - 160px)", overflowY: "auto" }}
          >
            {userRoutes.map((value, i) => (
              <div key={i} className="py-1">
                <div
                  style={{
                    backgroundColor: "#f0f2f5",
                    color: "#838383",
                    borderRadius: "5px",
                  }}
                >
                  <RenderItem value={value} i={i} style={{ color: "black" }} />
                </div>
              </div>
            ))}
          </List>
          <ReusableModal
            show={logOut}
            onHide={() => {
              setLogOut(false);
            }}
            onConfirm={() => {
              handleLogout(navigate);
            }}
            title="Log Out"
            description="Are you sure you want to log out of your profile?"
            icon={logoutIcon}
          />
          <List className="">
            <ListItemButton
              onClick={() => setLogOut(true)}
              sx={{
                ...buttonStyle,
                backgroundColor: "white",
                "&:hover": { backgroundColor: "#E3F5FF" },
              }}
            >
              <ListItemText
                className="flex"
                primary={
                  <Typography
                    variant="body2"
                    style={{ fontSize: 14, color: "#000", fontWeight: "bold" }}
                    title="Logout"
                  >
                    <div className="flex items-center gap-2">
                      <HiOutlineLogout className="text-dark text-base" />
                      Logout
                    </div>
                  </Typography>
                }
              />
            </ListItemButton>
          </List>
        </div>
      </div>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
        bgcolor: "black",
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "white",
            color: "black",
            zIndex: { md: 1000, xs: 1200 },
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            bgcolor: "transparent",
            border: 0,
            color: "black",
            width: drawerWidth,
            zIndex: { md: 1100, xs: 1200 },
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideNav;
