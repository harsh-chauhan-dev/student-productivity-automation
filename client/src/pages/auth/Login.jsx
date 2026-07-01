import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/auth.service.js";
import Card from "../../component/ui/Card";
import Input from "../../component/ui/Input";
import Button from "../../component/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser: setAuthUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);
      setAuthUser(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-800">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to your productivity workspace</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button loading={loading} type="submit">Login</Button>
        </form>
        <p className="text-sm mt-4 text-center text-slate-600">
          New here? <Link to="/register" className="text-blue-600">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
