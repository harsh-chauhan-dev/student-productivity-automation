import { useEffect, useState } from "react";
import { getReminders, createReminder, deleteReminder } from "../../services/reminder.service";
import { getTasks } from "../../services/task.service";
import Card from "../../component/ui/Card";
import Input from "../../component/ui/Input";
import Button from "../../component/ui/Button";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ task_id: "", remind_at: "" });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [remindersRes, tasksRes] = await Promise.all([getReminders(), getTasks()]);
      setReminders(remindersRes.data?.reminders || []);
      setTasks(tasksRes.data?.tasks || []);
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
      await createReminder(form);
      setForm({ task_id: "", remind_at: "" });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    try {
      await deleteReminder(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create reminder</h2>
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Task
              <select className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" value={form.task_id} onChange={(e) => setForm({ ...form, task_id: e.target.value })} required>
                <option value="">Choose task</option>
                {tasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
              </select>
            </label>
            <Input label="Reminder time" type="datetime-local" value={form.remind_at} onChange={(e) => setForm({ ...form, remind_at: e.target.value })} required />
            <Button type="submit">Create reminder</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Reminder list</h2>
          {loading ? <p>Loading...</p> : reminders.length === 0 ? <p>No reminders yet.</p> : <div className="space-y-3">{reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <p className="font-medium">{reminder.task_title}</p>
                <p className="text-sm text-slate-500">{reminder.remind_at}</p>
              </div>
              <Button variant="danger" size="sm" onClick={() => remove(reminder.id)}>Delete</Button>
            </div>
          ))}</div>}
        </Card>
      </div>
    </div>
  );
}
