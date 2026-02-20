export default function AttendanceForm() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Mark Attendance
      </h2>

      <form className="grid md:grid-cols-3 gap-4">
        <input type="date" className="input" />

        <select className="input">
          <option>Present</option>
          <option>Absent</option>
        </select>

        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          Submit
        </button>
      </form>
    </div>
  );
}