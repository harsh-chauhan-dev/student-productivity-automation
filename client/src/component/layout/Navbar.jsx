import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-lg font-semibold text-white">
            CF
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">CampusFlow</p>
            <p className="text-xs text-slate-500">Smart study automation</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-blue-600">Features</a>
          <a href="#modules" className="transition hover:text-blue-600">Modules</a>
          <a href="#about" className="transition hover:text-blue-600">About</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            Login
          </Link>
          <Link to="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
