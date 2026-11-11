import { createBrowserRouter, redirect } from "react-router"
import AppLayout from "./AppLayout"
import AuthService from "./api/AuthService"
import HomePage from "./home/HomePage"
import LoginPage from "./login/LoginPage"
import SignupPage from "./signup/SignupPage"

const redirectIfSignedIn = () => (AuthService.isAuthenticated() ? redirect("/home") : null)
const requireSignedIn = () => (AuthService.isAuthenticated() ? null : redirect("/login"))

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        index: true,
        loader: () => redirect(AuthService.isAuthenticated() ? "/home" : "/login")
      },
      {
        path: "login",
        loader: redirectIfSignedIn,
        Component: LoginPage
      },
      {
        path: "signup",
        loader: redirectIfSignedIn,
        Component: SignupPage
      },
      {
        path: "home",
        loader: requireSignedIn,
        Component: HomePage
      }
    ]
  }
])
