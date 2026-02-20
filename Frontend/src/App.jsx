import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1">
          <Topbar />

          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
            </Routes>
          </main>
        </div>
      </div>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;