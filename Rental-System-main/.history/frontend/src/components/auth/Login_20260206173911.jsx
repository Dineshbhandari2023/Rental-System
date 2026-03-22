// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import Message from "../common/Message";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const responseGoogle = async (authResult) => {
//     try {
//       console.log(authResult);
//     } catch (error) {
//       console.error("Error while requesting google code:", error);
//     }
//   };
//   // const GoogleLogin = useGoogleLogin({fforgot-
//   //   onSuccess: () => {},
//   //   onError: () => {},
//   //   flow: "auth-code",
//   // });

//   const { login, error: authError, setError } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setError(null);

//   //   if (!validateForm()) return;

//   //   setIsLoading(true);

//   //   const result = await login(formData.email, formData.password);

//   //   setIsLoading(false);

//   //   if (result.success) {
//   //     navigate("/dashboard");
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//       const result = await login(formData.email, formData.password);

//       if (result.success) {
//         const role = result.user.role;

//         // Role-based redirection
//         if (role === "admin") {
//           navigate("/admin/dashboard"); // or "/admin"
//         } else if (role === "lender") {
//           navigate("/lender/dashboard");
//         } else if (role === "borrower") {
//           navigate("/borrower/dashboard"); // or "/dashboard" or "/home"
//         } else {
//           // Fallback for any unexpected role
//           navigate("/dashboard");
//         }
//       }
//     } catch (err) {
//       setError(err.message || "Login failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-stone-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <h2 className="mt-6 text-4xl font-serif font-bold text-amber-950">
//             Sign in to your account
//           </h2>
//           <p className="mt-4 text-base font-serif text-amber-900">
//             Or{" "}
//             <Link
//               to="/register"
//               className="font-serif font-semibold text-amber-800 hover:text-amber-950 underline decoration-dotted"
//             >
//               create a new account
//             </Link>
//           </p>
//         </div>

//         <div className="bg-amber-50 border-4 border-amber-800 shadow-2xl p-8">
//           {authError && (
//             <Message
//               type="error"
//               message={authError}
//               onClose={() => setError(null)}
//             />
//           )}

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-base font-serif font-semibold text-amber-950 mb-2"
//               >
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
//                   errors.email ? "border-red-600" : "border-amber-800"
//                 }`}
//                 placeholder="you@example.com"
//               />
//               {errors.email && (
//                 <p className="mt-2 text-sm font-serif text-red-800">
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label
//                   htmlFor="password"
//                   className="block text-base font-serif font-semibold text-amber-950"
//                 >
//                   Password
//                 </label>
//                 <div className="text-sm">
//                   <Link
//                     to="/forgot-password"
//                     className="font-serif font-semibold text-amber-800 hover:text-amber-950 underline decoration-dotted"
//                   >
//                     Forgot your password?
//                   </Link>
//                 </div>
//               </div>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
//                   errors.password ? "border-red-600" : "border-amber-800"
//                 }`}
//                 placeholder="••••••••"
//               />
//               {errors.password && (
//                 <p className="mt-2 text-sm font-serif text-red-800">
//                   {errors.password}
//                 </p>
//               )}
//             </div>

//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-5 w-5 border-2 border-amber-800 text-amber-800 focus:ring-amber-800"
//               />
//               <label
//                 htmlFor="remember-me"
//                 className="ml-3 block text-base font-serif text-amber-900"
//               >
//                 Remember me
//               </label>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full flex justify-center items-center bg-amber-800 text-amber-50 font-serif font-bold text-lg px-6 py-4 border-4 border-amber-950 hover:bg-amber-900 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-6 w-6 text-amber-50"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Signing in...
//                   </>
//                 ) : (
//                   "Sign in"
//                 )}
//               </button>
//             </div>
//           </form>

//           <div className="mt-8">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t-2 border-amber-800"></div>
//               </div>
//               <div className="relative flex justify-center text-base">
//                 <span className="px-4 bg-amber-50 text-amber-900 font-serif font-semibold">
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-4">
//               <button
//                 type="button"
//                 className="w-full inline-flex justify-center py-3 px-4 border-2 border-amber-800 bg-amber-100 text-base font-serif font-semibold text-amber-900 hover:bg-amber-200 transition-colors"
//               >
//                 <span className="sr-only">Sign in with Google</span>
//                 <svg
//                   className="w-6 h-6"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
//                 </svg>
//               </button>

//               <button
//                 type="button"
//                 className="w-full inline-flex justify-center py-3 px-4 border-2 border-amber-800 bg-amber-100 text-base font-serif font-semibold text-amber-900 hover:bg-amber-200 transition-colors"
//               >
//                 <span className="sr-only">Sign in with Facebook</span>
//                 <svg
//                   className="w-6 h-6"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

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

  const { login, error: authError, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        const role = result.user.role;

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "lender") {
          navigate("/lender/dashboard");
        } else if (role === "borrower") {
          navigate("/borrower/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Very subtle vintage paper-like noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-200/90 tracking-tight drop-shadow-md">
            Welcome Back
          </h2>
          <p className="mt-3 text-lg font-serif text-slate-400">
            Sign in to continue your journey
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-amber-400/90 hover:text-amber-300 transition-colors underline decoration-amber-500/40 underline-offset-4"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Card – vintage dark aesthetic */}
        <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Inner subtle glow/bevel effect */}
          <div className="relative p-8 md:p-10">
            {authError && (
              <div className="mb-6">
                <Message
                  type="error"
                  message={authError}
                  onClose={() => setError(null)}
                />
              </div>
            )}

            <form className="space-y-7" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="peer w-full bg-transparent border-b-2 border-slate-600 text-slate-100 placeholder-transparent focus:border-amber-500/80 focus:outline-none py-3 text-lg font-serif transition-colors"
                  placeholder="Email address"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-6 text-sm font-serif text-slate-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-slate-500 peer-focus:-top-6 peer-focus:text-amber-400/90 transition-all duration-200"
                >
                  Email address
                </label>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-400 font-serif">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="peer w-full bg-transparent border-b-2 border-slate-600 text-slate-100 placeholder-transparent focus:border-amber-500/80 focus:outline-none py-3 text-lg font-serif transition-colors"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-6 text-sm font-serif text-slate-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-slate-500 peer-focus:-top-6 peer-focus:text-amber-400/90 transition-all duration-200"
                >
                  Password
                </label>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-400 font-serif">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 text-amber-600 focus:ring-amber-500/40"
                  />
                  <span className="text-slate-300 font-serif">Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-amber-400/80 hover:text-amber-300 font-serif underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-gradient-to-br from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white font-serif font-semibold text-lg py-3.5 rounded-lg border border-amber-600/40 shadow-lg shadow-amber-900/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 font-serif">
          Trouble signing in? Contact support
        </p>
      </div>
    </div>
  );
};

export default Login;
