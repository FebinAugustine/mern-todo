import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
