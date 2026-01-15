export default function NotFound() {
  return (
    <div className="ui-container ui-main-content min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
      <p className="text-4xl font-bold">404 – Page Not Found</p>

      <p className="text-lg text-gray-500 max-w-md">
        The page you are looking for does not exist.
      </p>

      <a
        href="/"
        className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 mt-2"
      >
        Go back home
      </a>
    </div>
  );
}
