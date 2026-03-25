import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Shared/AuthLayout/AuthLayout";
import AuthContextProvider from "./Context/AuthContext";
import ProtectedRoute from "./Shared/ProtectedRoutes/ProtectedRoutes";
import Login from "./Modules/AuthModule/components/Login/Login";
import Register from "./Modules/AuthModule/components/Register/Register";
import ForgotPassword from "./Modules/AuthModule/components/ForgotPassword/ForgotPassword";
import ChangePassword from "./Modules/AuthModule/components/ChangePassword/ChangePassword";
import ResetPassword from "./Modules/AuthModule/components/ResetPassword/ResetPassword";
import MasterLayout from "./Shared/MasterLayout/MasterLayout";
import Dashboard from "./Modules/DashboardModule/Dashboard";
import Quizes from "./Modules/QuizesModule/Components/Quizes";
import Students from "./Modules/StudentsModule/Components/Students";
import Groups from "./Modules/GroupsModule/Components/Groups";
import Results from "./Modules/ResultsModule/Components/Results";
import Questions from "./Modules/Questions/Components/Questions";
import QuizDetails from "./Modules/QuizesModule/Components/QuizDetails";
import ResultView from "./Modules/ResultsModule/Components/Result-view/ResultView";
import StudentQuiz from "./Modules/QuizesModule/Components/StudentQuiz";
import { ThemeContextProvider } from "./Context/DarkModeContext";

function App() {
  let routes = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "reset-password", element: <ResetPassword /> },
      ],
    },
    {
      path: "dashboard",
      element: (
        <ProtectedRoute>
          <MasterLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "groups",
          element: (
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <Groups />
            </ProtectedRoute>
          ),
        },
        {
          path: "quizes",
          element: <Quizes />,
        },
        {
          path: "quizes/:id",
          element: (
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <QuizDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "results",
          element: <Results />,
        },
        {
          path: "students",
          element: (
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <Students />
            </ProtectedRoute>
          ),
        },
        {
          path: "questions",
          element: (
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <Questions />
            </ProtectedRoute>
          ),
        },
        {
          path: "change-password",
          element: <ChangePassword />,
        },
        {
          path: "quiz-result-view",
          element: (
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <ResultView />
            </ProtectedRoute>
          ),
        },
        { path: "student-quiz", element: <StudentQuiz /> },
      ],
    },
  ]);

  return (
    <>
      <ThemeContextProvider>
        <AuthContextProvider>
          <ToastContainer />
          <RouterProvider router={routes} />
        </AuthContextProvider>
      </ThemeContextProvider>
    </>
  );
}

export default App;
