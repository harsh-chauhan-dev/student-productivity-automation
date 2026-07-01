import { useAuth } from "../../context/AuthContext";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";

export default function Profile() {
  const { user, logoutUser: clearAuth } = useAuth();
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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-4">Profile</h1>
          <p className="text-slate-600">Name: {user?.name || "-"}</p>
          <p className="text-slate-600">Email: {user?.email || "-"}</p>
          <div className="mt-6">
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
