import { createBrowserRouter, redirect } from "react-router"
import AppLayout from "./AppLayout"
import LoginPage from "./login/LoginPage"
import SignupPage from "./signup/SignupPage"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        index: true,
        loader: () => redirect("/login")
      },
      {
        path: "login",
        Component: LoginPage
      },
      {
        path: "signup",
        Component: SignupPage
      }
    ]
  }
])
