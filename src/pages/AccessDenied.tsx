import { Lock, LogIn } from "lucide-react";

const AccessDenied = () => {
  const handleLogin = () => {
    console.log("Redirecting to login...");
    window.location.href = "/login"; 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-6 mx-auto">
          <Lock size={32} className="text-gray-400" />
        </div>

        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">401</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          You don't have permission to view this page. Please sign in to your
          account to continue.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <LogIn size={18} />
            Sign In
          </button>
        </div>

        <div className="pt-6 border-t border-gray-50">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
