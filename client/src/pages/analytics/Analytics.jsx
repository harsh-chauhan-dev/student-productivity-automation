import { useEffect, useState } from "react";
import { getAnalytics } from "../../services/analytics.service";
import Card from "../../component/ui/Card";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnalytics();
        setAnalytics(res.data?.data || null);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-slate-800">Analytics</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-5"><p className="text-sm text-slate-500">Subjects</p><p className="text-2xl font-semibold">{analytics?.subjects ?? 0}</p></Card>
          <Card className="p-5"><p className="text-sm text-slate-500">Tasks</p><p className="text-2xl font-semibold">{analytics?.tasks ?? 0}</p></Card>
          <Card className="p-5"><p className="text-sm text-slate-500">Study minutes</p><p className="text-2xl font-semibold">{analytics?.studyMinutes ?? 0}</p></Card>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5"><p className="text-sm text-slate-500">Completed tasks</p><p className="text-2xl font-semibold">{analytics?.completedTasks ?? 0}</p></Card>
          <Card className="p-5"><p className="text-sm text-slate-500">Pending tasks</p><p className="text-2xl font-semibold">{analytics?.pendingTasks ?? 0}</p></Card>
        </div>
      </div>
    </div>
  );
}
