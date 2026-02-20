export default function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`input-modern ${
          error ? "border-danger focus:ring-danger/20" : ""
        }`}
      />

      {error && (
        <p className="text-sm text-danger flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}