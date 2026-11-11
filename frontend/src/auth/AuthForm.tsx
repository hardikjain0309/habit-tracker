import { useState, type SubmitEvent } from "react";
import { Link as RouterLink } from "react-router";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ApiError } from "../tools/Request";

export interface AuthFormValues {
  name: string;
  email: string;
  password: string;
}

type FieldErrors = Partial<Record<keyof AuthFormValues, string>>;

interface AuthFormProps {
  subtitle: string;
  passwordPlaceholder: string;
  submitLabel: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  /** Show the Name field (sign up). */
  withName?: boolean;
  onSubmit: (values: AuthFormValues) => Promise<void>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS: (keyof AuthFormValues)[] = ["name", "email", "password"];

function validate({ name, email, password }: AuthFormValues, withName: boolean): FieldErrors {
  const errors: FieldErrors = {};
  if (withName && !name.trim()) errors.name = "Name is required";
  if (!email.trim()) errors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email";
  if (!password) errors.password = "Password is required";
  return errors;
}

function AuthForm({
  subtitle,
  passwordPlaceholder,
  submitLabel,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  withName = false,
  onSubmit,
}: AuthFormProps) {
  const [values, setValues] = useState<AuthFormValues>({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [serverFieldErrors, setServerFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  const clientErrors = validate(values, withName);
  const fieldError = (field: keyof AuthFormValues) =>
    (submitted ? clientErrors[field] : undefined) || serverFieldErrors[field];

  const handleChange = (field: keyof AuthFormValues) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setServerFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setFormError("");
    setServerFieldErrors({});
    if (Object.keys(clientErrors).length > 0) return;

    setPending(true);
    try {
      await onSubmit({ name: values.name.trim(), email: values.email.trim(), password: values.password });
    } catch (error) {
      if (error instanceof ApiError && error.validationErrors) {
        const mapped: FieldErrors = {};
        for (const field of FIELDS) {
          const messages = error.validationErrors[field];
          if (messages?.length) mapped[field] = messages[0];
        }
        setServerFieldErrors(mapped);
        if (Object.keys(mapped).length === 0) setFormError(error.message);
      } else {
        setFormError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      }
    } finally {
      setPending(false);
    }
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
        {formError && <Alert severity="error">{formError}</Alert>}
        {withName && (
          <TextField
            variant="filled"
            label="Name"
            autoComplete="name"
            placeholder="Enter your name"
            value={values.name}
            onChange={(e) => handleChange("name")(e.target.value)}
            error={!!fieldError("name")}
            helperText={fieldError("name")}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        )}
        <TextField
          variant="filled"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={values.email}
          onChange={(e) => handleChange("email")(e.target.value)}
          error={!!fieldError("email")}
          helperText={fieldError("email")}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          variant="filled"
          label="Password"
          type="password"
          autoComplete={withName ? "new-password" : "current-password"}
          placeholder={passwordPlaceholder}
          value={values.password}
          onChange={(e) => handleChange("password")(e.target.value)}
          error={!!fieldError("password")}
          helperText={fieldError("password")}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>
      <Button type="submit" size="small" variant="contained" loading={pending}>
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
