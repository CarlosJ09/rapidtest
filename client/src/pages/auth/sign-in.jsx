import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { login } from "../../api/auth.api";
import { SESSION_KEY, SESSION_ROLES } from "../../constants/session";

function SignInPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await login(formData);
      const data = res.data;

      if (res.status === 200 && data?.token) {
        setError("");
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));

        if (data?.user?.groups?.includes(SESSION_ROLES.STUDENT)) {
          navigate("/student");
        } else if (data?.user?.groups?.includes(SESSION_ROLES.INSTRUCTOR)) {
          navigate("/instructor");
        } else if (data?.user?.groups?.length) {
          navigate("/instructor");
        }
      } else if (data?.detail) {
        setError(data.detail);
      } else if (data?.non_field_errors?.length) {
        setError(data.non_field_errors[0]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="bg-surface w-screen h-screen flex justify-center items-center px-12 ">
      <h1 className="absolute left-4 top-4 text-3xl font-semibold">Rapid Test</h1>

      <div className="max-w-96 w-full h-full flex flex-col justify-center items-start">
        <h2 className="text-5xl font-semibold">Sign In</h2>

        <p className="mt-4">
          Don't have an account?{" "}
          <Link className="text-primary underline" to={"/auth/sign-up"}>
            Sign up
          </Link>
        </p>

        <form className="relative w-full flex flex-col gap-4 mt-16 py-8" onSubmit={handleSubmit}>
          <p className="absolute text-danger text-sm font-semibold top-0">{error}</p>

          <TextInput
            type="text"
            name={"username"}
            placeholder="Username"
            onChange={handleChange}
            inputStyles={error && "border border-danger focus:ring-danger"}
            required
          />

          <TextInput
            type="password"
            name={"password"}
            placeholder="Password"
            onChange={handleChange}
            inputStyles={error && "border border-danger focus:ring-danger"}
            required
          />

          <Button
            type="submit"
            text="Sign In"
            buttonStyles={"bg-primary text-white rounded-lg p-3 mt-4"}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}

export default SignInPage;
