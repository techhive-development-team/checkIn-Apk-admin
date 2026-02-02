import { Search, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl text-center">
        <div className="card-body">

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center">
              <Search size={32} className="opacity-50" />
            </div>
          </div>

          <h1 className="text-5xl font-bold">404</h1>
          <h2 className="text-xl font-semibold mt-2">Page Not Found</h2>

          <p className="text-base-content/70 mt-3">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div className="card-actions flex flex-col gap-3 mt-6">
            <button
              onClick={handleGoHome}
              className="btn btn-primary w-full gap-2"
            >
              <Home size={18} />
              Back to Home
            </button>

            <button
              onClick={handleGoBack}
              className="btn btn-outline w-full gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotFound;
