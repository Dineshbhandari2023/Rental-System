import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Message from "../common/Message";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  LockClosedIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Register = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "borrower",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "NP",
    },
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, error: authError, setError } = useAuth();
  const navigate = useNavigate();

  const nepalProvinces = [
    "Province No. 1 (Koshi)",
    "Madhesh Province",
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ──────────────────────────────────────────────
  // Validation functions (unchanged)
  // ──────────────────────────────────────────────

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    else if (formData.firstName.length < 2)
      newErrors.firstName = "At least 2 characters";

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    else if (formData.lastName.length < 2)
      newErrors.lastName = "At least 2 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ""))
    ) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.address.street.trim())
      newErrors["address.street"] = "Street is required";
    if (!formData.address.city.trim())
      newErrors["address.city"] = "City is required";
    if (!formData.address.state)
      newErrors["address.state"] = "Province is required";
    if (!formData.address.zipCode.trim())
      newErrors["address.zipCode"] = "ZIP code is required";
    else if (!/^\d{5}$/.test(formData.address.zipCode)) {
      newErrors["address.zipCode"] = "5-digit ZIP code required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "At least 6 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Needs uppercase, lowercase & number";
    }

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password";
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) newErrors.role = "Please select role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateStep3()) return;

    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName.trim());
    formDataToSend.append("lastName", formData.lastName.trim());
    formDataToSend.append("email", formData.email.trim());
    formDataToSend.append("phone", formData.phone.trim());
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);

    formDataToSend.append(
      "address",
      JSON.stringify({
        street: formData.address.street.trim(),
        city: formData.address.city.trim(),
        state: formData.address.state,
        zipCode: formData.address.zipCode.trim(),
        country: formData.address.country,
      })
    );

    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    const result = await register(formDataToSend);
    setIsLoading(false);

    if (result.success) {
      navigate("/dashboard");
    }
  };

  // ──────────────────────────────────────────────
  // Reusable input renderer (no separate component)
  // ──────────────────────────────────────────────
  const renderInput = ({
    label,
    id,
    name,
    type = "text",
    icon: Icon,
    error,
    helpText,
    ...props
  }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-serif font-semibold text-amber-200 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-amber-600" />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={
            name.includes(".")
              ? formData[name.split(".")[0]][name.split(".")[1]]
              : formData[name]
          }
          onChange={handleChange}
          className={`w-full ${
            Icon ? "pl-12" : "pl-4"
          } pr-4 py-3 bg-gray-800/50 border-2 font-serif text-amber-100 placeholder-amber-700/50 focus:outline-none focus:border-amber-600 focus:bg-gray-800 transition-all duration-300 rounded-md ${
            error ? "border-red-500/50" : "border-amber-900/30"
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm font-serif text-red-400 flex items-center gap-1">
          <span className="text-red-500">⚠</span> {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-xs font-serif italic text-amber-600/70">
          {helpText}
        </p>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput({
          label: "First Name *",
          id: "firstName",
          name: "firstName",
          icon: UserIcon,
          error: errors.firstName,
          placeholder: "John",
          autoComplete: "given-name",
        })}
        {renderInput({
          label: "Last Name *",
          id: "lastName",
          name: "lastName",
          icon: UserIcon,
          error: errors.lastName,
          placeholder: "Doe",
          autoComplete: "family-name",
        })}
      </div>

      {renderInput({
        label: "Email Address *",
        id: "email",
        name: "email",
        type: "email",
        icon: EnvelopeIcon,
        error: errors.email,
        placeholder: "you@example.com",
        autoComplete: "email",
      })}

      {renderInput({
        label: "Phone Number *",
        id: "phone",
        name: "phone",
        type: "tel",
        icon: PhoneIcon,
        error: errors.phone,
        placeholder: "+977 981-2345678",
        helpText: "We'll use this for important notifications",
        autoComplete: "tel",
      })}

      <div>
        <label className="block text-sm font-serif font-semibold text-amber-200 mb-2">
          Profile Image
        </label>
        <div className="relative border-2 border-dashed border-amber-900/30 bg-gray-800/30 p-6 hover:border-amber-700/50 transition-all duration-300 rounded-md">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-center">
            <UserIcon className="mx-auto h-12 w-12 text-amber-600/50" />
            <p className="mt-2 text-sm font-serif text-amber-300">
              {profileImage ? profileImage.name : "Click to upload"}
            </p>
            <p className="mt-1 text-xs font-serif text-amber-600/70">
              JPG, PNG or WEBP. Max 2MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {renderInput({
        label: "Street Address *",
        id: "address.street",
        name: "address.street",
        icon: MapPinIcon,
        error: errors["address.street"],
        placeholder: "Itahari, Halgada",
        autoComplete: "street-address",
      })}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput({
          label: "City *",
          id: "address.city",
          name: "address.city",
          error: errors["address.city"],
          placeholder: "Itahari / Kathmandu",
          autoComplete: "address-level2",
        })}

        <div>
          <label className="block text-sm font-serif font-semibold text-amber-200 mb-2">
            Province *
          </label>
          <select
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-800/50 border-2 font-serif text-amber-100 focus:outline-none focus:border-amber-600 focus:bg-gray-800 transition-all duration-300 rounded-md ${
              errors["address.state"]
                ? "border-red-500/50"
                : "border-amber-900/30"
            }`}
          >
            <option value="">Select province</option>
            {nepalProvinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors["address.state"] && (
            <p className="mt-1 text-sm font-serif text-red-400">
              {errors["address.state"]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput({
          label: "ZIP Code *",
          id: "address.zipCode",
          name: "address.zipCode",
          error: errors["address.zipCode"],
          placeholder: "44600",
          autoComplete: "postal-code",
        })}

        <div>
          <label className="block text-sm font-serif font-semibold text-amber-200 mb-2">
            Country *
          </label>
          <select
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/50 border-2 border-amber-900/30 font-serif text-amber-100 focus:outline-none focus:border-amber-600 focus:bg-gray-800 transition-all duration-300 rounded-md"
          >
            <option value="NP">Nepal</option>
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-2 border-blue-700/30 p-4 rounded-md">
        <div className="flex gap-3">
          <ShieldCheckIcon className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-serif text-blue-200 leading-relaxed">
            Your address is used for location-based searches and delivery
            coordination. We never share your exact address publicly.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Role selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-serif font-semibold text-amber-200 mb-4">
            I want to be a *
          </label>
          <div className="space-y-3">
            {[
              {
                value: "borrower",
                label: "Borrower",
                desc: "I want to rent items from others",
              },
              {
                value: "lender",
                label: "Lender",
                desc: "I want to lend my items to others",
              },
            ].map((r) => (
              <label
                key={r.value}
                className={`flex items-start p-4 border-2 cursor-pointer transition-all duration-300 rounded-md ${
                  formData.role === r.value
                    ? "bg-gradient-to-r from-amber-900/30 to-amber-800/20 border-amber-600"
                    : "bg-gray-800/30 border-amber-900/20 hover:border-amber-800/40"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  checked={formData.role === r.value}
                  onChange={handleChange}
                  className="mt-1 h-5 w-5 border-2 border-amber-700 text-amber-600 focus:ring-amber-600"
                />
                <div className="ml-3">
                  <span className="block text-base font-serif font-semibold text-amber-200">
                    {r.label}
                  </span>
                  <span className="block text-sm font-serif text-amber-400/70 mt-1">
                    {r.desc}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.role && (
            <p className="mt-2 text-sm text-red-400">{errors.role}</p>
          )}
        </div>

        {/* Benefits box */}
        <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border-2 border-amber-800/30 p-6 rounded-md h-fit">
          <h4 className="font-serif font-bold text-amber-200 mb-4 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-amber-500" />
            Role Benefits
          </h4>
          <ul className="text-sm font-serif text-amber-300/80 space-y-3">
            {formData.role === "borrower" && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">✓</span> Rent items
                  affordably
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">✓</span> No need to buy
                  expensive items
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">✓</span> Access to verified
                  lenders
                </li>
              </>
            )}
            {formData.role === "lender" && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">✓</span> Earn from unused
                  items
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">✓</span> Built-in protection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">✓</span> Verified borrowers
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Password fields */}
      {renderInput({
        label: "Password *",
        id: "password",
        name: "password",
        type: showPassword ? "text" : "password",
        icon: LockClosedIcon,
        error: errors.password,
        placeholder: "••••••••",
        autoComplete: "new-password",
      })}

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-amber-600 hover:text-amber-400 z-10"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {renderInput({
        label: "Confirm Password *",
        id: "confirmPassword",
        name: "confirmPassword",
        type: showConfirmPassword ? "text" : "password",
        icon: LockClosedIcon,
        error: errors.confirmPassword,
        placeholder: "••••••••",
        autoComplete: "new-password",
      })}

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-amber-600 hover:text-amber-400 z-10"
        >
          {showConfirmPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="space-y-4 pt-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            required
            className="mt-1 h-5 w-5 border-2 border-amber-700 text-amber-600 focus:ring-amber-600"
          />
          <span className="text-sm font-serif text-amber-300/90 group-hover:text-amber-200">
            I agree to the{" "}
            <Link
              to="/terms"
              className="font-semibold text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-semibold text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 border-2 border-amber-700 text-amber-600 focus:ring-amber-600"
          />
          <span className="text-sm font-serif text-amber-300/90 group-hover:text-amber-200">
            I want to receive updates about new features and promotions
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(217, 119, 6) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
          className="absolute inset-0"
        />
      </div>

      <div className="absolute top-20 left-10 w-24 h-24 border-2 border-amber-700/20" />
      <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-amber-700/20 rounded-full" />

      <div className="max-w-3xl w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 mb-4">
            Create Your Account
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-4" />
          <p className="text-lg font-serif text-amber-300/80 italic">
            Join our community of sharers and renters
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-amber-900/30 shadow-2xl p-8 md:p-10 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-amber-700/30" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-amber-700/30" />

          {authError && (
            <div className="mb-6">
              <Message
                type="error"
                message={authError}
                onClose={() => setError(null)}
              />
            </div>
          )}

          {/* Step indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-center">
              {[1, 2, 3].map((n) => (
                <React.Fragment key={n}>
                  <div
                    className={`rounded-full relative flex items-center justify-center w-14 h-14 border-2 font-serif font-bold text-lg ${
                      step >= n
                        ? "bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 border-amber-700 shadow-lg shadow-amber-900/50"
                        : "bg-gray-800 text-amber-400/50 border-amber-800/30"
                    }`}
                  >
                    {step > n ? <CheckCircleIcon className="w-7 h-7" /> : n}
                    {step >= n && (
                      <>
                        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400/50" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400/50" />
                      </>
                    )}
                  </div>
                  {n < 3 && (
                    <div
                      className={`w-24 h-1 mx-2 ${
                        step > n
                          ? "bg-gradient-to-r from-amber-800 to-amber-900"
                          : "bg-amber-900/30"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-6 text-sm font-serif px-4">
              {["Personal Info", "Address", "Security"].map((label, i) => (
                <span
                  key={label}
                  className={
                    step >= i + 1
                      ? "text-amber-300 font-bold"
                      : "text-amber-600/50"
                  }
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-between items-center mt-10 pt-6 border-t-2 border-amber-900/20">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center bg-gray-700/50 text-amber-300 font-serif font-bold text-base px-6 py-3 border-2 border-amber-800/50 hover:bg-gray-700 hover:border-amber-700 transition-all rounded-md"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Back
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-amber-400 hover:text-amber-300 font-serif text-sm underline decoration-dotted"
                >
                  Already have an account?
                </Link>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center bg-gradient-to-r from-amber-800 to-amber-900 text-white font-serif font-bold text-base px-8 py-3 border-2 border-amber-700 hover:border-amber-600 transition-all shadow-lg shadow-amber-900/50 hover:shadow-amber-700/50 rounded-md"
                >
                  Continue
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center bg-gradient-to-r from-amber-800 to-amber-900 text-white font-serif font-bold text-base px-8 py-3 border-2 border-amber-700 hover:border-amber-600 transition-all shadow-lg shadow-amber-900/50 hover:shadow-amber-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Account
                      <CheckCircleIcon className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-base font-serif text-amber-400/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
