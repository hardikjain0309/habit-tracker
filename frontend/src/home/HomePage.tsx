import { useNavigate } from "react-router";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AuthService from "../api/AuthService";

// Placeholder until the real home screen is designed.
function HomePage() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    AuthService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <Stack spacing={2} sx={{ alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <Typography variant="h1">You’re signed in!</Typography>
      <Button size="small" variant="contained" onClick={handleSignOut}>
        Sign Out
      </Button>
    </Stack>
  );
}

export default HomePage;
