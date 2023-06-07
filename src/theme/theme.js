import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#343090'
        },
        secondary: {
            main: '#5f59f7'
        },
        error: {
            main: '#f7a400'
        },
        warning: {
            main: '#6592fd'
        },
        info: {
            main: '#44c2fd'
        },
        success: {
            main: '#6592fd'
        },
        neutral: {
            main: '#ffffff'
        },
        dark: {
            main: '#000000'
        },
        opposite: {
            main: '#ffc34d'
        },
        lightprop: {
            main: '#F3F3F3',
            opposite: '#000000'
        }
    },
    typography: {
        fontFamily: [
          'Raleway'
        ].join(','),
      },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    },
    typography: {
        fontFamily: [
          'Nunito'
        ].join(','),
      },
})
