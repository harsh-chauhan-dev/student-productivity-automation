import { useEffect, useState } from "react";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "../../services/subject.service";
import Card from "../../component/ui/Card";
import Input from "../../component/ui/Input";
import Button from "../../component/ui/Button";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: "", color_hex: "#3b82f6", target_hours_per_week: 5 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSubjects = async () => {
    try {
      const res = await getSubjects();
      setSubjects(res.data?.subjects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSubjects(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSubject(editingId, form);
      } else {
        await createSubject(form);
      }
      setForm({ name: "", color_hex: "#3b82f6", target_hours_per_week: 5 });
      setEditingId(null);
      loadSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    try {
      await deleteSubject(id);
      loadSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Subjects</h2>
          {loading ? <p>Loading...</p> : subjects.length === 0 ? <p>No subjects yet.</p> : <div className="space-y-3">{subjects.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <p className="font-medium">{subject.name}</p>
                <p className="text-sm text-slate-500">Target: {subject.target_hours_per_week} hrs/week</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setForm({ name: subject.name, color_hex: subject.color_hex || "#3b82f6", target_hours_per_week: subject.target_hours_per_week || 5 }) && setEditingId(subject.id)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => remove(subject.id)}>Delete</Button>
              </div>
            </div>
          ))}</div>}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit subject" : "Add subject"}</h2>
          <form onSubmit={submit} className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Color" type="color" value={form.color_hex} onChange={(e) => setForm({ ...form, color_hex: e.target.value })} />
            <Input label="Target hours/week" type="number" value={form.target_hours_per_week} onChange={(e) => setForm({ ...form, target_hours_per_week: Number(e.target.value) })} />
            <Button type="submit">{editingId ? "Save changes" : "Create subject"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
