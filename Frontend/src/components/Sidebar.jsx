import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, CalendarCheck } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white/90 backdrop-blur-sm shadow-lg border-r border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            HRMS Lite
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                : "hover:bg-gray-50 text-gray-700"
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                : "hover:bg-gray-50 text-gray-700"
            }`
          }
        >
          <Users size={20} />
          <span className="font-medium">Employees</span>
        </NavLink>

        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                : "hover:bg-gray-50 text-gray-700"
            }`
          }
        >
          <CalendarCheck size={20} />
          <span className="font-medium">Attendance</span>
        </NavLink>
      </nav>
    </div>
  );
}