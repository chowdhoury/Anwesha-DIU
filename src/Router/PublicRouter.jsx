import { createBrowserRouter } from "react-router";
import PublicLayout from "../Layout/PublicLayout";
import HomePage from "../Pages/HomePage/HomePage";
import SignIn from "../Pages/Auth/SignIn";
import SignUp from "../Pages/Auth/SignUp";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import MyProfile from "../Pages/MyProfile/MyProfile";
import SkillMarketplace from "../Pages/SkillMarketplace/SkillMarketplace";
import ProjectCatalog from "../Pages/ProjectCatalog/ProjectCatalog";
import SkillDetail from "../Pages/SkillDetail/SkillDetail";
import PostSkill from "../Pages/PostSkill/PostSkill";
import Rewards from "../Pages/Rewards/Rewards";
import MyRewards from "../Pages/Rewards/MyRewards";
import FindRequests from "../Pages/FindRequests/FindRequests";
import Community from "../Pages/Community/Community";
import NotFound from "../Pages/NotFound/NotFound";
import PostRequest from "../Pages/PostRequest/PostRequest";
import Dashboard from "../Pages/Dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "my-profile",
        element: <MyProfile />,
      },
      {
        path: "skill-marketplace",
        element: <SkillMarketplace />,
      },

      {
        path: "project-catalog",
        element: <ProjectCatalog />,
      },
      {
        path: "skill/:id",
        element: <SkillDetail />,
      },
      {
        path: "post-skill",
        element: <PostSkill />,
      },
      {
        path: "rewards",
        element: <Rewards />,
      },
      {
        path: "my-rewards",
        element: <MyRewards />,
      },
      {
        path: "find-requests",
        element: <FindRequests />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "post-request",
        element: <PostRequest />,
      },
      {
        path: "community",
        element: <Community />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);

