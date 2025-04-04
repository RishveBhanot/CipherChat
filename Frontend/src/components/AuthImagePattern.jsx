const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-8 mt-4">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl bg-blue-700 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
              style={{ width: "120px", height: "120px" }}
            />
          ))}
        </div>
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-base text-base-content/70">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
