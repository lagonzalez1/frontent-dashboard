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
            main: '#fc0303'
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
        },
        alert: {
            main: '#ffe500'
        }
    },
    
    
});

export const ClientWelcomeTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff5722',
    },
    info: {
      main: '#616161',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
  }
})

export const ClientWaitingTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff5722',
    },
    info: {
      main: '#424242',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
  }
})


export const DashboardThemeLight = createTheme({
    palette: {
        mode: 'light',
        primary: {
          main: '#455a64',
        },
        secondary: {
          main: '#ff6d00',
        },
        error: {
          main: '#d50000',
        },
      },
      typography: {
        h3: {
          fontSize: '4rem',
          fontWeight: 500,
          color: 'blue',
        },
      },
})

export const DashboardThemeDark = createTheme({
    palette: {
        mode: 'dark',
        primary: {
          main: '#455a64',
        },
        secondary: {
          main: '#ff6d00',
        },
        error: {
          main: '#d50000',
        },
      },
      typography: {
        h3: {
          fontSize: '4rem',
          fontWeight: 500,
          color: 'blue',
        },
      },
})

export const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    },

})
