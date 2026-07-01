import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../../services/task.service";
import { getSubjects } from "../../services/subject.service";
import Card from "../../component/ui/Card";
import Input from "../../component/ui/Input";
import Button from "../../component/ui/Button";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", status: "pending", due_date: "", estimated_minutes: 30, subject_id: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [tasksRes, subjectsRes] = await Promise.all([getTasks(), getSubjects()]);
      setTasks(tasksRes.data?.tasks || []);
      setSubjects(subjectsRes.data?.subjects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTask(editingId, form);
      } else {
        await createTask(form);
      }
      setForm({ title: "", description: "", priority: "medium", status: "pending", due_date: "", estimated_minutes: 30, subject_id: subjects[0]?.id || "" });
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    try {
      await deleteTask(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          {loading ? <p>Loading...</p> : tasks.length === 0 ? <p>No tasks yet.</p> : <div className="space-y-3">{tasks.map((task) => (
            <div key={task.id} className="rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-slate-500">{task.subject_name} • {task.priority}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setForm({ title: task.title, description: task.description || "", priority: task.priority || "medium", status: task.status || "pending", due_date: task.due_date || "", estimated_minutes: task.estimated_minutes || 30, subject_id: task.subject_id || "" }) && setEditingId(task.id)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => remove(task.id)}>Delete</Button>
                </div>
              </div>
              <p className="text-sm mt-2 text-slate-600">{task.description}</p>
            </div>
          ))}</div>}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit task" : "Add task"}</h2>
          <form onSubmit={submit} className="space-y-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <select className="w-full rounded-lg border border-gray-300 px-4 py-3" value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} required>
              <option value="">Choose subject</option>
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-gray-700">Priority
                <select className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-700">Status
                <select className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Due date" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
              <Input label="Estimated minutes" type="number" value={form.estimated_minutes} onChange={(e) => setForm({ ...form, estimated_minutes: Number(e.target.value) })} />
            </div>
            <Button type="submit">{editingId ? "Save changes" : "Create task"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
