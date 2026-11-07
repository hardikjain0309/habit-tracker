import { ThemeProvider } from "@emotion/react";
import Container from "@mui/material/Container";
import { Outlet } from "react-router";
import { theme } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";

function AppLayout() {
  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container maxWidth='sm'>
      <Outlet />
    </Container>
  </ThemeProvider>
}

export default AppLayout;