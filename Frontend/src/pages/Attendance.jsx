import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import Button from "../components/Button";
import { useNotifications } from "../context/NotificationContext";
import {
  Search,
  Filter,
  X,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";

export default function Attendance() {
  const { notify } = useNotifications();
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [marking, setMarking] = useState(false);
  const [markError, setMarkError] = useState("");

  const [newRecord, setNewRecord] = useState({
    employee_id: "",
    date: new Date().toISOString().slice(0, 10),
    status: "Present",
  });

  const [viewEmployeeId, setViewEmployeeId] = useState(null);
  const [viewEmployeeName, setViewEmployeeName] = useState("");
  const [employeeRecords, setEmployeeRecords] = useState([]);
  const [loadingView, setLoadingView] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/api/v1/employees/");
        setEmployees(Array.isArray(res.data) ? res.data : []);
      } catch {
        setEmployees([]);
      }
    };
    fetchEmployees();
  }, []);

  // Load existing attendance for all employees from the API
  useEffect(() => {
    const loadAllAttendance = async () => {
      if (!employees.length) {
        setRecords([]);
        return;
      }

      setLoadingRecords(true);
      const allRecords = [];

      try {
        for (const emp of employees) {
          try {
            const res = await API.get(`/api/v1/attendance/${emp.id}`);
            const data = Array.isArray(res.data) ? res.data : [];

            data.forEach((r, idx) => {
              allRecords.push({
                id: r.id ?? `${emp.id}-${r.date}-${idx}`,
                employee_id: emp.id,
                employee_name: emp.full_name,
                date: r.date,
                status: r.status,
              });
            });
          } catch {
            // Ignore per-employee attendance errors to avoid blocking others
          }
        }

        setRecords(allRecords);
      } finally {
        setLoadingRecords(false);
      }
    };

    loadAllAttendance();
  }, [employees]);

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch =
        rec.employee_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.date?.includes(searchQuery);
      const matchesStatus = !statusFilter || rec.status === statusFilter;
      const matchesDate = !dateFilter || rec.date === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [records, searchQuery, statusFilter, dateFilter]);

  const totalPresent = filteredRecords.filter(
    (r) => r.status === "Present"
  ).length;
  const totalAbsent = filteredRecords.filter(
    (r) => r.status === "Absent"
  ).length;

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    const empId = newRecord.employee_id ? Number(newRecord.employee_id) : null;
    if (!empId) {
      setMarkError("Please select an employee.");
      return;
    }

    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;

    setMarkError("");
    setMarking(true);
    try {
      await API.post("/api/v1/attendance/", {
        employee_id: empId,
        date: newRecord.date,
        status: newRecord.status,
      });

      const record = {
        id: Date.now(),
        employee_id: emp.id,
        employee_name: emp.full_name,
        date: newRecord.date,
        status: newRecord.status,
      };

      setRecords((prev) => {
        const withoutExisting = prev.filter(
          (r) =>
            !(r.employee_id === record.employee_id && r.date === record.date)
        );
        return [...withoutExisting, record];
      });
      notify.success("Attendance marked successfully.");
    } catch (err) {
      const msg =
        err.response?.data?.detail?.toString?.() ||
        err.response?.data?.message ||
        "Failed to mark attendance.";
      setMarkError(msg);
      notify.error(msg);
    } finally {
      setMarking(false);
    }
  };

  const openEmployeeRecords = async (empId) => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;

    setViewEmployeeId(empId);
    setViewEmployeeName(emp.full_name);
    setEmployeeRecords([]);
    setLoadingView(true);

    try {
      const res = await API.get(`/api/v1/attendance/${empId}`);
      const data = res.data;
      setEmployeeRecords(Array.isArray(data) ? data : []);
    } catch {
      setEmployeeRecords([]);
      notify.error("Could not load attendance records.");
    } finally {
      setLoadingView(false);
    }
  };

  const closeEmployeeRecords = () => {
    setViewEmployeeId(null);
    setViewEmployeeName("");
    setEmployeeRecords([]);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Records</p>
              <p className="text-3xl font-bold text-gray-900">
                {filteredRecords.length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
              <CalendarCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Present</p>
              <p className="text-3xl font-bold text-success">{totalPresent}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Absent</p>
              <p className="text-3xl font-bold text-danger">{totalAbsent}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Mark Attendance + Records */}
      <div className="card-modern p-6 md:p-8 space-y-6">
        {/* Mark Attendance form */}
        <div className="border-b border-gray-100 pb-6 mb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-primary" />
              Mark Attendance
            </h3>
          </div>
          <form
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end"
            onSubmit={handleMarkAttendance}
          >
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Employee
              </label>
              <select
                className="input-modern w-full"
                value={newRecord.employee_id}
                onChange={(e) =>
                  setNewRecord((prev) => ({
                    ...prev,
                    employee_id: e.target.value,
                  }))
                }
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Date
              </label>
              <input
                type="date"
                className="input-modern w-full"
                value={newRecord.date}
                onChange={(e) =>
                  setNewRecord((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Status
              </label>
              <select
                className="input-modern w-full"
                value={newRecord.status}
                onChange={(e) =>
                  setNewRecord((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <div className="md:col-span-4 md:col-start-1 flex flex-wrap items-center gap-3">
              <Button type="submit" variant="primary" loading={marking}>
                Mark Attendance
              </Button>
              {markError && (
                <span className="text-sm text-danger">{markError}</span>
              )}
            </div>
          </form>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Attendance Records
            </h2>
            {filteredRecords.length !== records.length && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {filteredRecords.length} of {records.length}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                className="input-modern pl-10"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern pl-10 w-full"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                showFilters || statusFilter
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-200 hover:border-primary"
              }`}
            >
              <Filter className="w-4 h-4" />
              Status
              {statusFilter && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  1
                </span>
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Filter by Status</h3>
              <button
                onClick={() => {
                  setStatusFilter("");
                  setShowFilters(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !statusFilter
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => setStatusFilter("Present")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  statusFilter === "Present"
                    ? "bg-success text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Present
              </button>
              <button
                onClick={() => setStatusFilter("Absent")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  statusFilter === "Absent"
                    ? "bg-danger text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <XCircle className="w-4 h-4" />
                Absent
              </button>
            </div>
          </div>
        )}

        {loadingRecords ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <CalendarCheck className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">
              {searchQuery || statusFilter || dateFilter
                ? "No attendance records match your filters"
                : "No attendance marked yet. Use the form above to mark attendance."}
            </p>
            {(searchQuery || statusFilter || dateFilter) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  setDateFilter("");
                }}
                className="mt-2 text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="pb-4 px-4 font-semibold text-gray-700">
                    Employee
                  </th>
                  <th className="pb-4 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="pb-4 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="pb-4 px-4 font-semibold text-gray-700 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all"
                  >
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {rec.employee_name}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{rec.date}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                          rec.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {rec.status === "Present" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => openEmployeeRecords(rec.employee_id)}
                        >
                          View Records
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Records modal (API data) */}
      {viewEmployeeId != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-records-title"
          onClick={closeEmployeeRecords}
        >
          <div
            className="card-modern p-6 md:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={closeEmployeeRecords}
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 id="view-records-title" className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-primary" />
              Attendance for {viewEmployeeName}
            </h3>

            {loadingView ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
              </div>
            ) : employeeRecords.length === 0 ? (
              <p className="text-gray-500">
                No attendance records from server for this employee.
              </p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="pb-3 px-2 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="pb-3 px-2 font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...employeeRecords]
                    .sort((a, b) => (a.date < b.date ? 1 : -1))
                    .map((r, i) => (
                      <tr key={r.id ?? i} className="border-b border-gray-100">
                        <td className="px-2 py-3 text-gray-700">{r.date}</td>
                        <td className="px-2 py-3">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                              r.status === "Present"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {r.status === "Present" ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
