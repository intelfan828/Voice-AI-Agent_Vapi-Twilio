import CallbackForm from '@/components/CallbackForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Voice AI Callback Service
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Request a callback from our AI assistant. We'll call you back and help you with your needs.
          </p>
        </div>
        <div className="mt-10">
          <CallbackForm />
        </div>
      </div>
    </main>
  );
}
