import { useForm } from "react-hook-form";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import TextField from "../../components/Inputs/TextFieldProps";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../api/apiComponents/authApi.js";
import { toast } from "sonner";
import Loader from "../../components/Loader/Loader.js";

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data: SignupFormData) => {
    console.log("Signup Data:", data);
    const payload = {
      email: data.email,
      name: data.name,
      password: data.password,
    };

    try {
      const response = await registerUser(payload).unwrap();
      console.log("Registered successfully:", response);
      toast.success("Registered successfully!");
      navigate("/");
    } catch (error) {
      console.log("Registration failed:", error);

      if (error?.data?.error) {
        const fieldErrors = error.data.error;
        Object.entries(fieldErrors).forEach(([fieldName, message]) => {
          if (fieldName !== "Error") {
            setError(fieldName.toLowerCase(), {
              type: "server",
              message: message,
            });
          }
        });

        if (fieldErrors.Error) {
          toast.error(fieldErrors.Error);
        }
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  // Watch password for confirmation validation
  const password = watch("password");

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-2">Join us today!</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <TextField
              type="text"
              label="Full Name"
              name="name"
              placeholder="John Doe"
              leadingIcon={FiUser}
              error={errors.name?.message}
              register={register}
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              }}
            />

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
            <TextField
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="••••••••"
              leadingIcon={FiLock}
              error={errors.confirmPassword?.message}
              register={register}
              rules={{
                required: "Please confirm your password",
                validate: (value: string) =>
                  value === password || "Passwords don't match",
              }}
            />

            <button type="submit" className="auth-button">
              Sign Up
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/" className="auth-link">
              Log in
            </Link>
          </div>
        </div>
      </div>
      <Loader loading={isLoading} />
    </div>
  );
}
