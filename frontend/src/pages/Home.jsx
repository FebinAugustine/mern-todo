import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to TodoApp
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Organize your tasks and boost your productivity
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-gray-50"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
