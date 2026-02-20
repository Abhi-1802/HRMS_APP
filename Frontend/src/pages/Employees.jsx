import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNotifications } from "../context/NotificationContext";
import { Search, Filter, X, UserPlus, Trash2 } from "lucide-react";

export default function Employees() {
  const { notify } = useNotifications();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/api/v1/employees/");
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load employees.");
      notify.error("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.employee_id.trim() ||
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.department.trim()
    ) {
      setError("Please fill in all fields before adding an employee.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await API.post("/api/v1/employees/", {
        employee_id: form.employee_id.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
      });
      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });
      await fetchEmployees();
      notify.success("Employee added successfully.");
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d) => d.msg ?? d).join(", ")
        : detail?.toString?.() ?? err.response?.data?.message ?? "Failed to add employee.";
      setError(msg);
      notify.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await API.delete(`/api/v1/employees/${id}`);
      await fetchEmployees();
      notify.success("Employee removed.");
    } catch (err) {
      const msg = err.response?.data?.detail?.toString?.() ?? "Failed to delete employee.";
      setError(msg);
      notify.error(msg);
    }
  };

  const departments = useMemo(() => {
    const depts = [
      ...new Set(
        employees.map((emp) => emp.department).filter(Boolean)
      ),
    ];
    return depts.sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        emp.employee_id?.toLowerCase().includes(q) ||
        emp.full_name?.toLowerCase().includes(q) ||
        emp.email?.toLowerCase().includes(q);
      const matchesDepartment =
        !departmentFilter || emp.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchQuery, departmentFilter]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Add Employee */}
      <div className="card-modern p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Add Employee
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Input
            label="Employee ID"
            value={form.employee_id}
            onChange={(e) =>
              setForm({ ...form, employee_id: e.target.value })
            }
            required
          />
          <Input
            label="Full Name"
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
          <Input
            label="Department"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
            required
          />

          <div className="md:col-span-4">
            <Button
              type="submit"
              className="btn-gradient"
              loading={submitting}
            >
              Add Employee
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Employee Table */}
      <div className="card-modern p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Employee List
            </h2>
            {filteredEmployees.length !== employees.length && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {filteredEmployees.length} of {employees.length}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern pl-10 w-full"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                showFilters || departmentFilter
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-200 hover:border-primary"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {departmentFilter && (
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
              <h3 className="font-semibold text-gray-700">Filter by Department</h3>
              <button
                onClick={() => {
                  setDepartmentFilter("");
                  setShowFilters(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDepartmentFilter("")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !departmentFilter
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Departments
              </button>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDepartmentFilter(dept)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    departmentFilter === dept
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">
              {searchQuery || departmentFilter
                ? "No employees match your filters"
                : "No employees found. Add one above."}
            </p>
            {(searchQuery || departmentFilter) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setDepartmentFilter("");
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
                  <th className="pb-4 px-4 font-semibold text-gray-700">ID</th>
                  <th className="pb-4 px-4 font-semibold text-gray-700">Name</th>
                  <th className="pb-4 px-4 font-semibold text-gray-700">Email</th>
                  <th className="pb-4 px-4 font-semibold text-gray-700">Department</th>
                  <th className="pb-4 px-4 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all"
                  >
                    <td className="px-4 py-4 font-medium text-gray-900">{emp.employee_id}</td>
                    <td className="px-4 py-4 text-gray-700">{emp.full_name}</td>
                    <td className="px-4 py-4 text-gray-600">{emp.email}</td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-medium">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end">
                        <Button
                          variant="danger"
                          onClick={() => deleteEmployee(emp.id)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
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
    </div>
  );
}
