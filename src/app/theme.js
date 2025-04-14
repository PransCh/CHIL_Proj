import { createTheme } from '@mui/material/styles';
 
const getTheme = (mode)=>createTheme({
  palette: {
    mode,
    primary: {
      main: '#005C7A', // dark blue
      light: '#E6F5FA',// sky blue light
      dark: '#80D3F0', //sky blue(dark)
      darkblue:'#007DA9',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f44336', // Red
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#fff',
    },
    background: {
        default: mode === "light" ? "#f5f5f5" : "#121212",
        paper: mode === "light" ? "#005C7A" : "#1d1d1d",
      },
  },
});
 
export default getTheme;