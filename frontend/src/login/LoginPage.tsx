import AuthForm, { type AuthFormValues } from "../auth/AuthForm";

function LoginPage() {
  const handleSignIn = (values: AuthFormValues) => {
    // TODO: integrate with auth API (password grant token endpoint)
    console.info("Sign in submitted", { email: values.email });
  };

  return (
    <AuthForm
      subtitle="Sign in to continue"
      passwordPlaceholder="Enter your password"
      submitLabel="Sign In"
      footerText="Don’t have an account?"
      footerLinkLabel="Sign Up"
      footerLinkTo="/signup"
      onSubmit={handleSignIn}
    />
  );
}

export default LoginPage;
