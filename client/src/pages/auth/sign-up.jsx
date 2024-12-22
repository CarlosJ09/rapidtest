import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import ExamImage from "../../assets/exam.jpg";
import Dropdown from "../../components/ui/Dropdown";
import { register } from "../../api/auth.api";
import { SESSION_KEY, SESSION_ROLES } from "../../constants/session";

const fields = {
  first_name: "",
  last_name: "",
  username: "",
  password: "",
  confirm_password: "",
  groups: 1,
};

function SignUpPage() {
  const [formData, setFormData] = useState(fields);
  const [errors, setErrors] = useState({ ...fields, groups: "", detail: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const userTypeOptions = Object.values(SESSION_ROLES)
    .filter((el) => el !== 3)
    .map((role) => ({
      value: role,
      label: role === 1 ? "Instructor" : "Student",
    }));

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, groups: [formData.groups] };

    if (payload.password !== payload.confirm_password) {
      setErrors({ ...errors, password: "Passwords don't match" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(payload);
      const data = res.data;

      if (res.status === 200) {
        setErrors({ ...fields, groups: "", detail: "" });

        if (data?.token) {
          window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
          navigate("/auth/sign-in");
        }
      } else {
        setErrors(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface w-screen h-screen grid grid-cols-1 md:grid-cols-12">
      <div className="bg-gradient-to-br from-primary to-darkAcent hidden md:flex flex-col justify-center items-center col-span-5">
        <img src={ExamImage} alt="Exam image" className="w-64 lg:w-80 rounded-xl" />
      </div>

      <div className="h-full mx-auto px-12 col-span-7">
        <div className="h-full flex flex-col justify-center items-start">
          <h2 className="text-5xl font-semibold">Create an account</h2>

          <p className="mt-4">
            Already have an account?{" "}
            <Link className="text-primary underline" to={"/auth/sign-in"}>
              Sign in
            </Link>
          </p>

          <form className="relative w-full flex flex-col gap-4 mt-10 py-8" onSubmit={handleSubmit}>
            <p className="absolute text-danger text-sm font-semibold top-0">
              {Object.values(errors).find((error) => error)}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                type="text"
                placeholder="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                inputStyles={errors["first_name"] && "border border-danger focus:ring-danger"}
              />
              <TextInput
                type="text"
                placeholder="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                inputStyles={errors["last_name"] && "border border-danger focus:ring-danger"}
              />
            </div>
            <TextInput
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              inputStyles={errors["username"] && "border border-danger focus:ring-danger"}
            />
            <Dropdown
              name="groups"
              value={formData.groups}
              options={userTypeOptions}
              inputStyles={errors["groups"] && "border border-danger focus:ring-danger"}
              onChange={handleChange}
              required
            />

            <TextInput
              type="password"
              placeholder="Enter Your Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              inputStyles={errors["password"] && "border border-danger focus:ring-danger"}
              required
            />
            <TextInput
              type="password"
              placeholder="Confirm Your Password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              inputStyles={errors["password"] && "border border-danger focus:ring-danger"}
              required
            />

            <div className="w-full mt-4">
              <Button type="submit" text="Create Account" disabled={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
