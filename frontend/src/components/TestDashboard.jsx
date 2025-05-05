// Dashboard.jsx
import { useEffect } from "react";
import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    console.log("Dashboard mounted - User:", user);
  }, [user]);

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;
