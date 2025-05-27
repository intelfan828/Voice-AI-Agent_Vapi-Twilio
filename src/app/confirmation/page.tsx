'use client';

import { useSearchParams } from 'next/navigation';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId');

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Callback Requested!
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Thank you for your request. Our AI assistant will call you shortly.
            {requestId && (
              <span className="block mt-2 text-sm text-gray-400">
                Request ID: {requestId}
              </span>
            )}
          </p>
          <div className="mt-8">
            <p className="text-gray-600">
              Please keep your phone nearby. You will receive:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>• A call from our AI assistant</li>
              <li>• An email with a secure authentication link</li>
              <li>• Access to your personalized consultation portal</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 