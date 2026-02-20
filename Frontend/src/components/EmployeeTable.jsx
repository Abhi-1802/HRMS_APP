export default function EmployeeTable() {
  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Employee List</h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Department</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b hover:bg-gray-50">
            <td className="p-3">EMP001</td>
            <td className="p-3">John Doe</td>
            <td className="p-3">john@example.com</td>
            <td className="p-3">IT</td>
            <td className="p-3">
              <button className="text-red-500 hover:underline">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}