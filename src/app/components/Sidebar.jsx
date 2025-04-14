"use client";
 
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  Box,
  IconButton,
  styled,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
 
// Sidebar configuration
const sidebarItems = [
  {
    name: "Assigned Ideas",
    icon: "/list.png", // Assumes /public/list.png
    path: "/page1",
  },
  {
    name: "Submitted Assigned Ideas",
    icon: "/clipboard.png",
    path: "/page2",
  },
  {
    name: "Your Posted Ideas",
    icon: "/idea.png",
    path: "/page3",
  },
];
 
// Styled IconButton for a round hover circle
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.95), // ~6.8px, keeps hover circle compact
  borderRadius: "50%", // Perfect circle for hover effect
  "&:hover": {
    backgroundColor: theme.palette.primary.darkblue, // #E6F5FA, same as Navbar
    color: theme.palette.mode === "dark" ? "yellow" : "blue", // Retain existing color logic
  },
}));
 
const Sidebar = ({ toggleTheme, mode }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 72,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 60,
          top: 56, // Below Navbar (56px)
          height: "calc(100vh - 56px)",
          boxSizing: "border-box",
          backgroundColor: (theme) => theme.palette.background.paper, // #fff light, #1d1d1d dark
          borderRight: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.primary.light // #E6F5FA
              : theme.palette.primary.dark, // #80D3F0
        },
      }}
    >
      <Box sx={{ overflow: "auto", mt: 1 }}>
        <List>
          {sidebarItems.map((item) => (
            <Tooltip key={item.name} title={item.name} placement="right">
              <ListItem
                component={Link}
                href={item.path}
                sx={{
                  justifyContent: "center",
                  py: 1, // Tighter spacing
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <StyledIconButton color="inherit">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={24} // Small size matches Navbar icons
                      height={24}
                      style={{ objectFit: "contain" }}
                    />
                  </StyledIconButton>
                </ListItemIcon>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
 
export default Sidebar;