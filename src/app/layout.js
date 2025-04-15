"use client";

import { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import getTheme from "./theme";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import PostsCount from "./components/PostsCount";
import PostTable from "./components/PostTable";


export default function RootLayout({ children }) {
  const [mode, setMode] = useState("light");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar toggleTheme={toggleTheme} mode={mode} />
          <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 7, ml: "72px" }}>
              {children}
            </Box>
          </Box>
        </ThemeProvider>

        <div style={{ marginTop: '0px', marginLeft: '80px', padding: '5px' }}>
          <PostsCount />

          <PostTable />

        </div>
      </body>
    </html>
  );
}