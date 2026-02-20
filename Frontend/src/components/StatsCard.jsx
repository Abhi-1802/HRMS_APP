export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className="text-3xl font-bold mt-2 text-indigo-600">
        {value}
      </p>
    </div>
  );
}