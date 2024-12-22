import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentLayout from "./layouts/StudentLayout";
import InstructorLayout from "./layouts/InstructorLayout";
import SignUpPage from "./pages/auth/sign-up";
import SignInPage from "./pages/auth/sign-in";
import UnauthorizedPage from "./pages/unauthorized";
import InstructorHomePage from "./pages/instructor/home";
import StudentHomePage from "./pages/student/home";
import ProfilePage from "./pages/profile";
import TakeTestPage from "./pages/student/take";
import Logout from "./pages/logout";
import CreatePage from "./pages/instructor/create";
import StudentDetailPage from "./pages/student/detail";
import HistoryPage from "./pages/student/history";
import InstructorDetailPage from "./pages/instructor/detail";
import SavedTestsPage from "./pages/student/saved";
import useSession from "./hooks/useSession";
import { SESSION_ROLES } from "./constants/session";
import { Toaster } from "react-hot-toast";

function App() {
  const [session] = useSession();

  const { STUDENT, INSTRUCTOR, ADMIN } = SESSION_ROLES;

  return (
    <>
      <Toaster />

      <Routes>
        <Route path="auth">
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="sign-in" element={<SignInPage />} />
        </Route>

        {session?.user ? (
          <Route
            path="/"
            element={
              <Navigate
                to={session?.user?.groups?.includes(STUDENT) ? "/student" : "/instructor"}
              />
            }
          />
        ) : (
          <Route path="/" element={<Navigate to={"/auth/sign-in"} />} />
        )}

        <Route path="student" element={<ProtectedRoute allowedRoles={[STUDENT, ADMIN]} />}>
          <Route element={<StudentLayout />}>
            <Route path="" element={<StudentHomePage />} />
            <Route path="test/:id" element={<StudentDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="take-test/:id" element={<TakeTestPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="saved" element={<SavedTestsPage />} />
          </Route>
        </Route>

        <Route path="instructor" element={<ProtectedRoute allowedRoles={[INSTRUCTOR, ADMIN]} />}>
          <Route element={<InstructorLayout />}>
            <Route path="" element={<InstructorHomePage />} />
            <Route path="test/:id" element={<InstructorDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="create" element={<CreatePage />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
