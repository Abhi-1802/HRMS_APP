export default function EmployeeForm() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Add Employee</h2>

      <form className="grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Employee ID"
          className="input"
        />
        <input
          type="text"
          placeholder="Full Name"
          className="input"
        />
        <input
          type="email"
          placeholder="Email"
          className="input"
        />
        <input
          type="text"
          placeholder="Department"
          className="input"
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition md:col-span-4">
          Add Employee
        </button>
      </form>
    </div>
  );
}