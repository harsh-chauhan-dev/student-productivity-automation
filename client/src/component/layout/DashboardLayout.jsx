import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/auth.service";
import NotificationBell from "./NotificationBell";
const navItems = [
  { to: '/dashboard', label: "Dashboard" },
  { to: "/subjects", label: "Subjects" },
  { to: "/tasks", label: "Tasks" },
  { to: "/study", label: "Study Sessions" },
  { to: "/reminders", label: "Reminders" },
  { to: "/analytics", label: "Analytics" },
  { to: "/profile", label: "Profile" },
];

export default function DashboardLayout({ children }) {
  const { logoutUser: clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r bg-white p-5">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800">CampusFlow</h2>
            <p className="text-sm text-slate-500">Productivity workspace</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"}`
                }
              >
                    {item.label}
                    
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 flex items-center justify-between">
            <NotificationBell />
            <button onClick={handleLogout} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Logout
            </button>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
