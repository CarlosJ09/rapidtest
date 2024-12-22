import { Outlet } from "react-router-dom";
import Navbar from "../components/student/StudentNavbar";

function StudentLayout() {
  return (
    <div className="h-full min-h-screen bg-white">
      <Navbar />

      <div className="px-8 py-12">
        <Outlet />
      </div>
    </div>
  );
}

export default StudentLayout;
