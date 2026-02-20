export default function AttendanceTable() {
  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">
        Attendance Records
      </h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-3">Employee</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b hover:bg-gray-50">
            <td className="p-3">John Doe</td>
            <td className="p-3">2026-02-20</td>
            <td className="p-3 text-green-600">Present</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}