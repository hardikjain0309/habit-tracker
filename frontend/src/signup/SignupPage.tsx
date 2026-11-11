import { useNavigate } from "react-router";
import AuthService from "../api/AuthService";
import AuthForm, { type AuthFormValues } from "../auth/AuthForm";

function SignupPage() {
  const navigate = useNavigate();

  const handleSignUp = async ({ name, email, password }: AuthFormValues) => {
    await AuthService.signup({ name, email, password });
    // Sign the new user in right away so they land on the home screen.
    await AuthService.login(email, password);
    navigate("/home", { replace: true });
  };

  return (
    <AuthForm
      withName
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
