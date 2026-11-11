import { useNavigate } from "react-router";
import AuthService from "../api/AuthService";
import AuthForm, { type AuthFormValues } from "../auth/AuthForm";

function LoginPage() {
  const navigate = useNavigate();

  const handleSignIn = async ({ email, password }: AuthFormValues) => {
    await AuthService.login(email, password);
    navigate("/home", { replace: true });
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
