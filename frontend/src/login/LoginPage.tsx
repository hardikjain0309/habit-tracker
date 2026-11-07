import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function LoginPage() {
  return <Stack direction="column" sx={{alignItems: "center", justifyContent: "center", minHeight: '100vh'} } spacing={2}>
      <Typography variant="h1">Let’s keep track of time!</Typography>
      <Typography variant="body1">Sign in to continue</Typography>
      <Stack direction="column" spacing={2} sx={ { minWidth: "min(350px, 100vw)" } }>
        <TextField
          variant='filled'
          label='Email'
          placeholder="Enter your email"
           />
        <TextField
          variant='filled'
          label='Password'
          placeholder="Enter your password"
           />
      </Stack>
      <Button size="small" variant="contained">Sign In</Button>
    </Stack>
}

export default LoginPage;