"use client";

import { GlobalStyles } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { customTheme } from "@/theme/customTheme";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = customTheme();
  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            fontWeight: theme.typography.fontWeightRegular,
          },
        }}
      />
      {children}
    </ThemeProvider>

  );
}
