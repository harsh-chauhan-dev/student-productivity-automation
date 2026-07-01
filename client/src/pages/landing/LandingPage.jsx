import { Link } from "react-router-dom";
import Navbar from "../../component/layout/Navbar";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";

const highlights = [
  { title: "Task control", text: "Plan your assignments and keep deadlines visible." },
  { title: "Study sessions", text: "Track focus time and understand your productivity rhythm." },
  { title: "Smart reminders", text: "Stay ahead with automated reminders and notifications." },
];

const modules = [
  "Subjects",
  "Tasks",
  "Subtasks",
  "Study Sessions",
  "Reminders",
  "Analytics",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              Built for focused student life
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Organize study, tasks, and progress in one calm workspace.
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Student Flow helps you manage subjects, assignments, reminders, and learning sessions from one place so your academic routine feels lighter and more consistent.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button>Start free</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">Sign in</Button>
              </Link>
            </div>
          </div>

          <Card className="p-8 shadow-xl">
            <h2 className="text-xl font-semibold">Why students love it</h2>
            <div className="mt-6 space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <Card key={item.title} className="p-6">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="modules" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-3xl bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-semibold">Everything you need for a smoother semester</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {modules.map((module) => (
                <span key={module} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm">
                  {module}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
