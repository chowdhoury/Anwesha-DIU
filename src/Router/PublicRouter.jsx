import { createBrowserRouter, Outlet } from "react-router";
import PublicLayout from "../Layout/PublicLayout";
import DashboardLayout from "../Layout/DashboardLayout";
import ScrollToTop from "../Components/ScrollToTop/ScrollToTop";
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
import RequestDetail from "../Pages/RequestDetail/RequestDetail";
import Community from "../Pages/Community/Community";
import NotFound from "../Pages/NotFound/NotFound";
import PostRequest from "../Pages/PostRequest/PostRequest";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import MyRequests from "../Pages/Dashboard/MyRequests";
import MySkills from "../Pages/Dashboard/MySkills";
import MyCommunityPosts from "../Pages/Dashboard/MyCommunityPosts";
import MyProjects from "../Pages/MyProjects/MyProjects";
import MyOffers from "../Pages/MyOffers/MyOffers";
import Messages from "../Pages/Messages/Messages";
import Notifications from "../Pages/Notifications/Notifications";
import PrivateRouter from "./PrivateRouter";

export const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollToTop />
        <Outlet />
      </>
    ),
    children: [
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
            path: "request/:id",
            element: <RequestDetail />,
          },
          // {
          //   path: "dashboard",
          //   element: <Dashboard />,
          // },
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
        path: "/dashboard",
        element: (
          <PrivateRouter>
            <DashboardLayout />
          </PrivateRouter>
        ),
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "my-requests",
            element: <MyRequests />,
          },
          {
            path: "my-skills",
            element: <MySkills />,
          },
          {
            path: "my-projects",
            element: <MyProjects />,
          },
          {
            path: "my-offers",
            element: <MyOffers />,
          },
          {
            path: "community-posts",
            element: <MyCommunityPosts />,
          },
          {
            path: "messages",
            element: <Messages />,
          },
          {
            path: "notifications",
            element: <Notifications />,
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
    ],
  },
]);
