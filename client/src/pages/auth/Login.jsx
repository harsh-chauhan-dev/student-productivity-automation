import { Link } from "react-router-dom";
import Card from "../../component/ui/Card.jsx";
import Input from "../../component/ui/Input.jsx";
import Button from "../../component/ui/Button.jsx";
import Illustrations from "../../assets/login.svg";
import {login} from "../../services/auth.service.js";
import { useState } from "react";

function Login() {
  const [from, setFromDate] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFromDate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
      try {
        const response = await login(from);
     console.log("Success");
    console.log(response.data);
      } catch (error) {
              console.error(error.response?.data);
      }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row items-center justify-between gap-10 px-6 py-8 lg:px-12">
        {/* Left Section */}
        <section className="hidden lg:flex lg:w-1/2 flex-col justify-center pr-8 xl:pr-16">
          <h1 className="mb-4 text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
            Student Productivity
          </h1>

          <p className="mb-8 max-w-lg text-base md:text-lg leading-8 text-slate-600">
            Organize your academic life, track your study sessions, manage
            tasks, and stay productive every day.
          </p>

          <img
            src={Illustrations}
            alt="Study Illustration"
            className="
        w-full
        max-w-sm
        md:max-w-md
        lg:max-w-lg
        xl:max-w-xl
        h-auto
        object-contain
        mx-auto
        select-none
    "
          />
        </section>

        {/* Right Section */}

        <section className="w-full max-w-lg lg:max-w-md xl:max-w-lg lg:w-[45%]">
          <Card>
            <h2 className="mb-2 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Welcome Back
            </h2>

            <p className="mb-8 text-sm md:text-base text-gray-500 leading-6">
              Login to continue your productivity journey.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              
              <Input
                label="Email"
                type="email"
                name='email'
                value={from.email}
                onChange={handleChange}
                placeholder="jon@gmail.com"
              />

              <Input
                label="Password"
                type="password"
                name='password'
                value={from.password}
                onChange={handleChange}
                placeholder=" ******** "
              />

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit">Login</Button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?
              <Link
                to="/register"
                className="ml-2 font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Register
              </Link>
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}

export default Login;
