import { createTheme } from "@mui/material/styles";


const fonts = ["Roboto", "sans-serif"].join(",");

export const customTheme = () => {
  const theme = createTheme({
    typography: {
      fontFamily: fonts,
      allVariants: {
        fontFamily: fonts,
        fontWeight: 500,
      },
      fontWeightRegular: 500,
      fontWeightBold: 700,
      fontWeightMedium: 600,
      fontWeightLight: 400,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            "&:focus": {
              outline: "none",
            },
          },
        },
      },
      MuiTooltip: {
        defaultProps: {
          enterNextDelay: 1000,
          disableInteractive: true,
        },
      },

    },

    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,

      },
    },
    palette: {
      mode: "dark",
      background: {
        // default: "black",
        default: "#141414",
      },
      primary: {
        main: "#4281D4",
      },
      secondary: {
        main: "#F0C755",
      },
    },
  });
  return theme;
};
