import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Message from "../common/Message";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const responseGoogle = async (authResult) => {
    try {
      console.log(authResult);
    } catch (error) {
      console.error("Error while requesting google code:", error);
    }
  };
  const GoogleLogin = useGoogleLogin({
    onSuccess: () => {},
    onError: () => {},
    flow: "auth-code",
  });

  const { login, error: authError, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);

  //   if (!validateForm()) return;

  //   setIsLoading(true);

  //   const result = await login(formData.email, formData.password);

  //   setIsLoading(false);

  //   if (result.success) {
  //     navigate("/dashboard");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    setIsLoading(false);

    if (result.success) {
      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-serif font-bold text-amber-950">
            Sign in to your account
          </h2>
          <p className="mt-4 text-base font-serif text-amber-900">
            Or{" "}
            <Link
              to="/register"
              className="font-serif font-semibold text-amber-800 hover:text-amber-950 underline decoration-dotted"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="bg-amber-50 border-4 border-amber-800 shadow-2xl p-8">
          {authError && (
            <Message
              type="error"
              message={authError}
              onClose={() => setError(null)}
            />
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-base font-serif font-semibold text-amber-950 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
                  errors.email ? "border-red-600" : "border-amber-800"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm font-serif text-red-800">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-base font-serif font-semibold text-amber-950"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-serif font-semibold text-amber-800 hover:text-amber-950 underline decoration-dotted"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
                  errors.password ? "border-red-600" : "border-amber-800"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-sm font-serif text-red-800">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-5 w-5 border-2 border-amber-800 text-amber-800 focus:ring-amber-800"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-base font-serif text-amber-900"
              >
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-amber-800 text-amber-50 font-serif font-bold text-lg px-6 py-4 border-4 border-amber-950 hover:bg-amber-900 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-6 w-6 text-amber-50"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-amber-800"></div>
              </div>
              <div className="relative flex justify-center text-base">
                <span className="px-4 bg-amber-50 text-amber-900 font-serif font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border-2 border-amber-800 bg-amber-100 text-base font-serif font-semibold text-amber-900 hover:bg-amber-200 transition-colors"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border-2 border-amber-800 bg-amber-100 text-base font-serif font-semibold text-amber-900 hover:bg-amber-200 transition-colors"
              >
                <span className="sr-only">Sign in with Facebook</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
