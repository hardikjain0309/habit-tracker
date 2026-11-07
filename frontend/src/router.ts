import { createBrowserRouter } from "react-router"
import AppLayout from "./AppLayout"
import LoginPage from "./login/LoginPage"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        path: "login",
        Component: LoginPage
      }
    ]
  }
])