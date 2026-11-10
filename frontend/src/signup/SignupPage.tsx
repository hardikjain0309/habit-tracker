import AuthForm, { type AuthFormValues } from "../auth/AuthForm";

function SignupPage() {
  const handleSignUp = (values: AuthFormValues) => {
    // TODO: integrate with sign-up API
    console.info("Sign up submitted", { email: values.email });
  };

  return (
    <AuthForm
      subtitle="Create an account to continue"
      passwordPlaceholder="Create a password"
      submitLabel="Sign Up"
      footerText="Already have an account?"
      footerLinkLabel="Sign In"
      footerLinkTo="/login"
      onSubmit={handleSignUp}
    />
  );
}

export default SignupPage;
