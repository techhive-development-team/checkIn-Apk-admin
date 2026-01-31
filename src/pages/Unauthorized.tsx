import { Search, ArrowLeft, Home } from 'lucide-react';

const Unauthorized = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all">
        
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-6">
          <Search size={32} className="text-gray-400" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">403</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Unauthorized</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          You are not authorized for this section.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-sm"
          >
            <Home size={18} />
            Back to Home
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
