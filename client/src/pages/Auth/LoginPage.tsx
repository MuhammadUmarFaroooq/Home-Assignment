// pages/Login.tsx
import { useForm } from "react-hook-form";
import { FiMail, FiLock } from "react-icons/fi";
import TextField from "../../components/Inputs/TextFieldProps";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/authSlice";
import { useLoginMutation } from "../../api/apiComponents/authApi";
import Loader from "../../components/Loader/Loader";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [loginUser, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: LoginFormData) => {
    console.log("Login Data:", data);
    try {
      const response = await loginUser(data).unwrap();
      console.log("Logged in successfully:", response);
      localStorage.setItem("token", response.token);
      dispatch(setCredentials({ user: response.data, token: response.token }));
      toast.success("Logged in successfully!");
      navigate("/task-dashboard");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <TextField
              type="email"
              label="Email Address"
              name="email"
              placeholder="your@email.com"
              leadingIcon={FiMail}
              error={errors.email?.message}
              register={register}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
            />
            <TextField
              type="password"
              label="Password"
              name="password"
              placeholder="••••••••"
              leadingIcon={FiLock}
              error={errors.password?.message}
              register={register}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
            />

            <button type="submit" className="auth-button">
              Sign In
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <Loader loading={isLoading} />
    </div>
  );
}
