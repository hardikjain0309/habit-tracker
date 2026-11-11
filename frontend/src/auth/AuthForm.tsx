import { useState, type FormEvent } from "react";
import { Link as RouterLink } from "react-router";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export interface AuthFormValues {
  email: string;
  password: string;
}

interface AuthFormProps {
  subtitle: string;
  passwordPlaceholder: string;
  submitLabel: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  onSubmit: (values: AuthFormValues) => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }: AuthFormValues) {
  return {
    email: !email.trim()
      ? "Email is required"
      : !EMAIL_PATTERN.test(email.trim())
        ? "Enter a valid email"
        : "",
    password: !password ? "Password is required" : "",
  };
}

function AuthForm({
  subtitle,
  passwordPlaceholder,
  submitLabel,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  onSubmit,
}: AuthFormProps) {
  const [values, setValues] = useState<AuthFormValues>({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const errors = validate(values);

  const handleChange = (field: keyof AuthFormValues) => (value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (errors.email || errors.password) return;
    onSubmit({ email: values.email.trim(), password: values.password });
  };

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={handleSubmit}
      direction="column"
      spacing={2}
      sx={{ alignItems: "center", justifyContent: "center", minHeight: "100vh", py: 2 }}
    >
      <Typography variant="h1">Let’s keep track of time!</Typography>
      <Typography variant="body1">{subtitle}</Typography>
      <Stack direction="column" spacing={2} sx={{ width: "100%", maxWidth: 354 }}>
        <TextField
          variant="filled"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={values.email}
          onChange={(e) => handleChange("email")(e.target.value)}
          error={submitted && !!errors.email}
          helperText={submitted ? errors.email : undefined}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          variant="filled"
          label="Password"
          type="password"
          autoComplete={submitLabel === "Sign Up" ? "new-password" : "current-password"}
          placeholder={passwordPlaceholder}
          value={values.password}
          onChange={(e) => handleChange("password")(e.target.value)}
          error={submitted && !!errors.password}
          helperText={submitted ? errors.password : undefined}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>
      <Button type="submit" size="small" variant="contained">
        {submitLabel}
      </Button>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        <Typography variant="body1">{footerText}</Typography>
        <Link
          component={RouterLink}
          to={footerLinkTo}
          variant="body1"
          underline="hover"
          sx={{ fontWeight: 700 }}
        >
          {footerLinkLabel}
        </Link>
      </Stack>
    </Stack>
  );
}

export default AuthForm;
