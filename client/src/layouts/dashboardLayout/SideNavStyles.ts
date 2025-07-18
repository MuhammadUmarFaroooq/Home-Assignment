const listItemStyle = {
  color: "inherit",
  borderRadius: "5px",
  borderLeft: "4px solid gray",
};
const activelistItemStyle = {
  backgroundColor: "#d0ddf7",
  color: "white",
  borderLeft: "4px solid #146FEE",
  "& .myIconClass, & .MuiTypography-root": {
    color: "#146FEE",
  },
};
const buttonStyle = {
  borderRadius: "5px",
  color: "black",
  "&:hover": {
    backgroundColor: "#E1EBFF",
    color: "black",
    "& .myIconClass, & .MuiTypography-root": {
      color: "black",
    },
  },
};

export { listItemStyle, buttonStyle, activelistItemStyle };
