import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go Home
          </Link>
          <Link
            to="/events"
            className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
}
