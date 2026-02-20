export default function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) {
  const base =
    "px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md";

  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02]",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-[1.02]",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:scale-[1.02]",
    outline:
      "border-2 border-gray-200 hover:border-primary hover:bg-primary/5 text-gray-700 bg-white",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}