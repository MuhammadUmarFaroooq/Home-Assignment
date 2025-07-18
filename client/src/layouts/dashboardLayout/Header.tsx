import React, { useState } from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";

interface HeaderProps {
  setRightDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  rightDrawer: boolean;
}

const Header: React.FC<HeaderProps> = (props) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Navbar
        handleDrawerToggle={handleDrawerToggle}
        setRightDrawer={props.setRightDrawer}
        rightDrawer={props.rightDrawer}
      />
      <SideNav
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
    </>
  );
};

export default Header;