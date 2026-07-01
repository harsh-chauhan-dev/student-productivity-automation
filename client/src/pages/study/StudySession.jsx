import { useEffect, useState } from "react";
import { getSessions, startSession, endSession, deleteSession } from "../../services/study.service";
import { getSubjects } from "../../services/subject.service";
import { getTasks } from "../../services/task.service";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";

export default function StudySession() {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ subject_id: "", task_id: "" });

  const loadData = async () => {
    try {
      const [sessionsRes, subjectsRes, tasksRes] = await Promise.all([getSessions(), getSubjects(), getTasks()]);
      setSessions(sessionsRes.data?.sessions || []);
      setSubjects(subjectsRes.data?.subjects || []);
      setTasks(tasksRes.data?.tasks || []);
      const active = (sessionsRes.data?.sessions || []).find((session) => !session.ended_at);
      setActiveSessionId(active?.id || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const start = async (e) => {
    e.preventDefault();
    try {
      const res = await startSession(form);
      setActiveSessionId(res.data?.session?.id || null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const end = async (id) => {
    try {
      await endSession(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    try {
      await deleteSession(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Study sessions</h2>
          <form onSubmit={start} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Subject
              <select className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })}>
                <option value="">Choose subject</option>
                {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">Task
              <select className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" value={form.task_id} onChange={(e) => setForm({ ...form, task_id: e.target.value })}>
                <option value="">Optional task</option>
                {tasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
              </select>
            </label>
            <Button type="submit">Start session</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Session history</h2>
          {loading ? <p>Loading...</p> : sessions.length === 0 ? <p>No sessions yet.</p> : <div className="space-y-3">{sessions.map((session) => (
            <div key={session.id} className="rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session #{session.id}</p>
                  <p className="text-sm text-slate-500">Started: {session.started_at}</p>
                </div>
                <div className="flex gap-2">
                  {!session.ended_at ? <Button variant="outline" size="sm" onClick={() => end(session.id)}>End</Button> : null}
                  <Button variant="danger" size="sm" onClick={() => remove(session.id)}>Delete</Button>
                </div>
              </div>
              <p className="text-sm mt-2">Duration: {session.duration_minutes ?? 0} mins</p>
            </div>
          ))}</div>}
        </Card>
      </div>
    </div>
  );
}
