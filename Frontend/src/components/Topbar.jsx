export default function Topbar() {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 p-4 md:p-6 flex justify-between items-center">
      <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Welcome, Admin
          </span>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
          A
        </div>
      </div>
    </div>
  );
}