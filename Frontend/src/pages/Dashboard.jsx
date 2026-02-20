import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useNotifications } from "../context/NotificationContext";
import { Users, CalendarCheck, XCircle, PieChart } from "lucide-react";

export default function Dashboard() {
  const { notify } = useNotifications();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/api/v1/dashboard/summary");
        setStats(res.data);
      } catch (err) {
        const msg = "Failed to load dashboard summary.";
        setError(msg);
        notify.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const { totalEmployees, presentToday, absentToday, presentRate } = useMemo(() => {
    if (!stats) {
      return {
        totalEmployees: 0,
        presentToday: 0,
        absentToday: 0,
        presentRate: 0,
      };
    }
    const total = stats.total_employees ?? 0;
    const present = stats.present_today ?? 0;
    const absent = stats.absent_today ?? 0;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    return {
      totalEmployees: total,
      presentToday: present,
      absentToday: absent,
      presentRate: rate,
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card-modern p-6 border-red-200 bg-red-50/50">
          <p className="text-red-600 font-medium">
            {error || "No dashboard data available."}
          </p>
          <p className="text-sm text-red-500 mt-1">
            Check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top stats row */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card-modern p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {totalEmployees}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="card-modern p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Present Today</p>
            <p className="text-3xl font-bold text-success mt-2">
              {presentToday}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="card-modern p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Absent Today</p>
            <p className="text-3xl font-bold text-danger mt-2">
              {absentToday}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 text-white">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Second row: attendance rate + quick summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card-modern p-6 md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-800">
                Attendance Rate Today
              </h3>
            </div>
            <span className="text-sm text-gray-500">
              {presentToday} of {totalEmployees} employees present
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${presentRate}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{presentRate}% present</span>
            <span>{100 - presentRate}% absent</span>
          </div>
        </div>

        <div className="card-modern p-6 flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Quick Actions
          </h3>
          <p className="text-sm text-gray-600">
            Use these shortcuts to manage your HRMS quickly.
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <Link
              to="/employees"
              className="block px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition font-medium text-center"
            >
              View Employees
            </Link>
            <Link
              to="/attendance"
              className="block px-4 py-2.5 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 transition font-medium text-center"
            >
              Manage Attendance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}