// app/not-found.tsx or pages/404.tsx

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! The page you are looking for doesn't exist.</p>
      <a
        href="/"
        className="px-6 py-3 bg-green-600 hover:bg-green-700  text-white font-medium transition"
      >
        Go back home
      </a>
    </div>
  );
}
