import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAnalytics } from "../../services/analytics.service";
import { getTasks } from "../../services/task.service";
import { getSubjects } from "../../services/subject.service";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analyticsRes, tasksRes, subjectsRes] = await Promise.all([
          getAnalytics(),
          getTasks(),
          getSubjects(),
        ]);
        setAnalytics(analyticsRes.data?.data || null);
        setTasks(tasksRes.data?.tasks || []);
        setSubjects(subjectsRes.data?.subjects || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Welcome back</p>
            <h1 className="text-3xl font-semibold text-slate-800">{user?.name || "Student"}</h1>
          </div>
          <Link to="/profile"><Button variant="outline">Profile</Button></Link>
        </div>

        {loading ? <p>Loading dashboard...</p> : null}

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-5"><p className="text-sm text-slate-500">Subjects</p><p className="text-2xl font-semibold">{analytics?.subjects ?? subjects.length}</p></Card>
          <Card className="p-5"><p className="text-sm text-slate-500">Tasks</p><p className="text-2xl font-semibold">{analytics?.tasks ?? tasks.length}</p></Card>
          <Card className="p-5"><p className="text-sm text-slate-500">Completion</p><p className="text-2xl font-semibold">{analytics?.completionRate ?? 0}%</p></Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Quick actions</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/subjects"><Button>Subjects</Button></Link>
              <Link to="/tasks"><Button variant="secondary">Tasks</Button></Link>
              <Link to="/study"><Button variant="outline">Study sessions</Button></Link>
              <Link to="/reminders"><Button variant="secondary">Reminders</Button></Link>
              <Link to="/analytics"><Button variant="outline">Analytics</Button></Link>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Latest tasks</h2>
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex justify-between rounded-lg border px-3 py-2 text-sm">
                  <span>{task.title}</span>
                  <span className="text-slate-500">{task.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
