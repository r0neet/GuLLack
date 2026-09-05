import { createBrowserRouter, RouteObject } from "react-router-dom";
import Index from "@/pages/base/Index";
import NotFoundPage from "@/pages/error/NotFoundPage";
import Notification from "@/pages/base/Notification";

export const routes: RouteObject[] = [
    {
        path: "/",
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <Index />,
            },
            {
                path: "notifications",
                element: <Notification />,
            },
        ],
    },
];

export const router = createBrowserRouter(routes);
