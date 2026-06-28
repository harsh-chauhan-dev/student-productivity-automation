import { Link } from "react-router-dom";
import Card from "../../component/ui/Card.jsx";
import Input from "../../component/ui/Input.jsx";
import Button from "../../component/ui/Button.jsx";
import Illustration from '../../assets/register.svg';
import { register } from "../../services/auth.service.js";
import { useState } from "react";

function Register() {
  const [fromData, setFromData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword:""
  });

  const handleChnage = (e) => {
    const { name, value } = e.target;
    setFromData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

  }

  const handleSubmit =  async(e) => {
    e.preventDefault();
    try {
      const response = await register(fromData);
      console.log(response.data);

    } catch (error) {
      console.error(error.response?.data);
    }
  }
  return (
    <main className="min-h-screen bg-slate-100">
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row items-center justify-between gap-10 px-6 py-8 lg:px-12">
        {/* Left Side */}
    <section className="hidden lg:flex lg:w-1/2 flex-col justify-center pr-8 xl:pr-16">

         <h1 className="mb-4 text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Student Productivity
          </h1>

         <p className="mb-8 max-w-lg text-base md:text-lg leading-8 text-slate-600">
            Create an account and start managing your studies smarter.
          </p>

          <img
            src={Illustration}
            alt="Register Illustration"
            className=" w-full
        max-w-sm
        md:max-w-md
        lg:max-w-lg
        xl:max-w-xl
        h-auto
        object-contain
        mx-auto
        select-none"
          />

        </section>

        {/* Right Side */}

        <section className="w-full max-w-lg lg:max-w-md xl:max-w-lg lg:w-[45%]">

          <Card>

            <h2 className="mb-2 text-3xl md:text-4xl font-bold tracking-tight">
              Create Account 
            </h2>

           <p className="mb-8 text-sm md:text-base text-gray-500">
              Join and organize your academic life.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              <Input
                label="Full Name"
                name='name'
                value={fromData.name}
                onChange={handleChnage}
                placeholder="Enter your name"
              />

              <Input
                label="Email"
                type="email"
                name='email'
                value={fromData.email}
                onChange={handleChnage}
                placeholder="Jon@gmail.com"
              />

              <Input
                label="Password"
                type="password"
                name='password'
                value={fromData.password}
                onChange={handleChnage}
                placeholder=" ******** "
              />

              <Input
                label="Confirm Password"
                name='password'
                type="password"
                email='password'
                value={fromData.confrom_password}
                onChange={handleChnage}
                placeholder="********"
              />

              <label className="flex items-start gap-3 text-sm leading-6 text-gray-600 cursor-pointer">

                <input
                  type="checkbox"
                  className="mt-1 cursor-pointer "
                />

                <span>
                  I agree to the Terms & Conditions and Privacy Policy.
                </span>

              </label>

              <Button type="submit">
                Create Account
              </Button>

            </form>

            <p className="mt-8 text-center text-sm text-gray-600">

              Already have an account?

              <Link
                to="/login"
                className="ml-2 font-semibold text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </Card>
        </section>

      </div>
    </main>
  );
}

export default Register;