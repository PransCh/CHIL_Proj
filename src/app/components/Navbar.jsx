"use client";
 
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip,
  Badge,
  Select,
  FormControl,
  styled,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { FaSearch, FaBell, FaSun, FaMoon, FaGlobe } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
 
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: theme.palette.primary.darkblue, // #E6F5FA
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  marginTop: theme.spacing(-0.5),
  width: "100%",
  [theme.breakpoints.up("md")]: {
    marginLeft: theme.spacing(3),
    width: "30%",
  },
}));
 
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
 
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.5, 0.5, 0.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(2)})`,
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
 
const StyledLanguageSelect = styled(Select)(({ theme }) => ({
  fontSize: "0.875rem",
  borderRadius: theme.shape.borderRadius,
  "& .MuiSelect-select": {
    padding: theme.spacing(0.5, 3, 0.5, 1),
    display: "flex",
    alignItems: "center",
    color: "white",
  },
  "&:hover": {
    backgroundColor: theme.palette.primary.darkblue, // #E6F5FA
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  color: "white",
  height: "32px",
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.background.paper,
    color: "#fff",
  },
}));
 
const NotificationsMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    maxHeight: "300px",
    width: "300px",
    backgroundColor: theme.palette.background.paper,
    color: "#fff",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
}));
 
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.primary.darkblue, // #E6F5FA
  },
}));
 
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  justifyContent: "center",
  color: "#fff",
  padding: theme.spacing(1, 2),
  "&:hover": {
    backgroundColor: theme.palette.primary.darkblue, // #E6F5FA
  },
  minWidth: "100px",
}));
 
const Navbar = ({ toggleTheme, mode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
 
  const user = {
    name: "John Doe",
    role: "Admin",
    email: "john.doe@example.com",
    avatar: "/static/images/avatar.jpg",
  };
 
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
 
    fetchNotifications();
  }, []);
 
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleClose = () => {
    setAnchorEl(null);
  };
 
  const handleNotificationsMenu = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
 
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
 
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
 
  const handleNotificationYes = () => {
    router.push("/notifications");
    handleNotificationsClose();
  };
 
  return (
    <AppBar position="static" sx={{ height: "56px" }}>
      <Toolbar sx={{ minHeight: "56px", alignItems: "center" }}>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 0 }}>
          <Link href="/" passHref>
            <Image
              src="/celanese-logo-final.png"
              alt="Logo"
              width={170}
              height={70}
              style={{ verticalAlign: "middle", transform: "translateX(-38px)" }}
            />
          </Link>
        </Typography>
 
        <Box sx={{ flexGrow: 1 }} />
 
        <Search>
          <SearchIconWrapper>
            <FaSearch />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
 
        <Box sx={{ flexGrow: 1 }} />
 
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title={mode === "dark" ? "Light Mode" : "Dark Mode"}>
            <StyledIconButton onClick={toggleTheme} color="inherit">
              {mode === "dark" ? <FaSun /> : <FaMoon />}
            </StyledIconButton>
          </Tooltip>
 
          <Tooltip title="Notifications">
            <StyledIconButton color="inherit" onClick={handleNotificationsMenu}>
              <Badge badgeContent={notifications.length} color="secondary">
                <FaBell />
              </Badge>
            </StyledIconButton>
          </Tooltip>
          <NotificationsMenu
            sx={{ marginTop:" 7px" }}
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem
              disabled
              sx={{
                color: "#fff",
                justifyContent: "center",
                "&.Mui-disabled": {
                  opacity: 1,
                  color: "#fff",
                },
                padding: (theme) => theme.spacing(2),
              }}
            >
              Would you like to view the notifications?
            </MenuItem>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                padding: (theme) => theme.spacing(1, 2, 2, 2),
                justifyContent: "center",
              }}
            >
              <StyledMenuItem onClick={handleNotificationYes}>
                Yes
              </StyledMenuItem>
              <StyledMenuItem onClick={handleNotificationsClose}>
                No
              </StyledMenuItem>
            </Box>
          </NotificationsMenu>
 
          <FormControl sx={{ minWidth: 80 }}>
            <StyledLanguageSelect
              value={language}
              onChange={handleLanguageChange}
              displayEmpty
              renderValue={(selected) => (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaGlobe style={{ marginRight: "8px" }} />
                  {selected.toUpperCase()}
                </Box>
              )}
            >
              <MenuItem
                value="en"
                sx={{
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.darkblue,
                  },
                }}
              >
                English
              </MenuItem>
              <MenuItem
                value="es"
                sx={{
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.darkblue,
                  },
                }}
              >
                Spanish
              </MenuItem>
              <MenuItem
                value="fr"
                sx={{
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.darkblue,
                  },
                }}
              >
                French
              </MenuItem>
            </StyledLanguageSelect>
          </FormControl>
 
          <Tooltip title="Profile">
            <StyledIconButton onClick={handleMenu} color="inherit">
              <Avatar alt={user.name} src={user.avatar} />
            </StyledIconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                backgroundColor: (theme) => theme.palette.background.paper,
                color: "#fff",
              },
            }}
          >
            <MenuItem
              disabled
              sx={{
                color: "#fff",
                "&.Mui-disabled": {
                  opacity: 1,
                  color: "#fff",
                },
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ color: "#fff" }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  {user.role}
                </Typography>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  {user.email}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.darkblue,
                },
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
 
export default Navbar;