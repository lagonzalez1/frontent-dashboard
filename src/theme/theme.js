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

// Poppins ,sans-serif
export const ClientWelcomeTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#0077B6',
    },
    info: {
      main: '#00b3b3',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#3c00b3',
    },
    success: {
      main: '#14591D',
    }
  },
  typography: {
    fontFamily: "Poppins",
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          color: 'white'
        }
      }
    }
  }
})


// Poppins ,sans-serif
export const ClientWelcomeThemeDark = createTheme({
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
    }
  },
  typography: {
    fontFamily: "Poppins",
  },
})

export const ClientWaitingTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#001f7d',
    },
    info: {
      main: '#FF9800',
    },
    error: {
      main: '#FF0015',
    },
    warning: {
      main: '#FFC107',
    },
    success: {
      main: '#4caf50',
    }
  },
  typography: {
    fontFamily: "Poppins",
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          color: 'white'
        }
      }
    }
  }
});


export const HomePageTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#673ab7',
      contrastText: 'rgba(255,255,255,0.87)',

    },
    secondary: {
      main: '#b73a71',
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
  },
  typography: {
    fontFamily: "Poppins",
  },
});


export const DashboardThemeLight = createTheme({
    palette: {
        mode: 'light',
        primary: {
          main: '#0077B6',
          light: '#0098E9'
        },
        secondary: {
          main: '#04080f',
        },
        error: {
          main: '#E71D36',
        },
        info: {
          main: '#FFFFFF'
        },
        success: {
          main: '#14591d'
        },
        warning: {
          main: '#F46036',
          light: '#EA3E0D'
        },
        complementary: {
          main: '#6036F4'
        }
      },
      typography: {
        h3: {
          fontSize: '4rem',
          fontWeight: 500,
          color: 'blue',
        },
      },
      typography: {
        fontFamily: "Poppins",
      },
      components: {
        MuiListItemText: {
          styleOverrides: {
            root:{
              fontWeight: 500,
            }
          }
        }
      }
})

export const DashboardThemeDark = createTheme({
    palette: {
        mode: 'dark',
        primary: {
          main: '#0a394e',
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
      typography: {
        fontFamily: "Poppins",
      },
})

export const RegisterTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#673ab7',
    },
    secondary: {
      main: '#b73a71',
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
  },
  typography: {
    fontFamily: 'Poppins',
  }
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    },

})
