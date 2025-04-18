"use client";

import { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import getTheme from "./theme";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import PostsCount from "./components/PostsCount";
import PostTable from "./components/PostTable";
import { LocaleProvider } from "./LocaleProvider";


export default function RootLayout({ children, params }) {
  const [mode, setMode] = useState("light");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <LocaleProvider>
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

        </body>
      </html>
    </LocaleProvider>
  );
}