import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Message from "../common/Message";

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
      country: "USA",
    },
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, error: authError, setError } = useAuth();
  const navigate = useNavigate();

  // US States for dropdown
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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.address.street.trim()) {
      newErrors["address.street"] = "Street address is required";
    }

    if (!formData.address.city.trim()) {
      newErrors["address.city"] = "City is required";
    }

    if (!formData.address.state) {
      newErrors["address.state"] = "State is required";
    }

    if (!formData.address.zipCode.trim()) {
      newErrors["address.zipCode"] = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.address.zipCode)) {
      newErrors["address.zipCode"] = "Please enter a valid ZIP code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Please select your role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

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

    // Address must be stringified
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

    // Profile image (optional)
    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    const result = await register(formDataToSend);

    setIsLoading(false);

    if (result.success) {
      navigate("/dashboard");
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {[1, 2, 3].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div
              className={`flex items-center justify-center w-12 h-12 border-4 font-serif font-bold text-lg ${
                step >= stepNumber
                  ? "bg-amber-800 text-amber-50 border-amber-950"
                  : "bg-amber-100 text-amber-800 border-amber-800"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-20 h-2 ${
                  step > stepNumber ? "bg-amber-800" : "bg-amber-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm font-serif">
        <span
          className={`${
            step >= 1 ? "text-amber-950 font-bold" : "text-amber-700"
          }`}
        >
          Personal Info
        </span>
        <span
          className={`${
            step >= 2 ? "text-amber-950 font-bold" : "text-amber-700"
          }`}
        >
          Address
        </span>
        <span
          className={`${
            step >= 3 ? "text-amber-950 font-bold" : "text-amber-700"
          }`}
        >
          Security
        </span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-base font-serif font-semibold text-amber-950 mb-2"
          >
            First Name *
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
              errors.firstName ? "border-red-600" : "border-amber-800"
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-2 text-sm font-serif text-red-800">
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-base font-serif font-semibold text-amber-950 mb-2"
          >
            Last Name *
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
              errors.lastName ? "border-red-600" : "border-amber-800"
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-2 text-sm font-serif text-red-800">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-base font-serif font-semibold text-amber-950 mb-2"
        >
          Email Address *
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
          <p className="mt-2 text-sm font-serif text-red-800">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-base font-serif font-semibold text-amber-950 mb-2"
        >
          Phone Number *
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
            errors.phone ? "border-red-600" : "border-amber-800"
          }`}
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && (
          <p className="mt-2 text-sm font-serif text-red-800">{errors.phone}</p>
        )}
        <p className="mt-2 text-sm font-serif italic text-amber-800">
          We'll use this for important notifications
        </p>
      </div>
      <div>
        <label
          htmlFor="profileImage"
          className="block text-base font-serif font-semibold text-amber-950 mb-2"
        >
          Profile Image
        </label>

        <input
          id="profileImage"
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImage(e.target.files[0])}
          className="w-full px-4 py-2 border-2 border-amber-800 bg-amber-50 font-serif text-amber-950"
        />

        <p className="mt-2 text-sm font-serif italic text-amber-800">
          JPG, PNG or WEBP. Max 2MB.
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="address.street"
          className="block text-base font-serif font-semibold text-amber-950 mb-2"
        >
          Street Address *
        </label>
        <input
          id="address.street"
          name="address.street"
          type="text"
          autoComplete="street-address"
          required
          value={formData.address.street}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
            errors["address.street"] ? "border-red-600" : "border-amber-800"
          }`}
          placeholder="123 Main St"
        />
        {errors["address.street"] && (
          <p className="mt-2 text-sm font-serif text-red-800">
            {errors["address.street"]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="address.city"
            className="block text-base font-serif font-semibold text-amber-950 mb-2"
          >
            City *
          </label>
          <input
            id="address.city"
            name="address.city"
            type="text"
            autoComplete="address-level2"
            required
            value={formData.address.city}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
              errors["address.city"] ? "border-red-600" : "border-amber-800"
            }`}
            placeholder="New York"
          />
          {errors["address.city"] && (
            <p className="mt-2 text-sm font-serif text-red-800">
              {errors["address.city"]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="address.state"
            className="block text-base font-serif font-semibold text-amber-950 mb-2"
          >
            State *
          </label>
          <select
            id="address.state"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
              errors["address.state"] ? "border-red-600" : "border-amber-800"
            }`}
          >
            <option value="">Select a state</option>
            {nepalProvinces.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors["address.state"] && (
            <p className="mt-2 text-sm font-serif text-red-800">
              {errors["address.state"]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="address.zipCode"
            className="block text-base font-serif font-semibold text-amber-950 mb-2"
          >
            ZIP Code *
          </label>
          <input
            id="address.zipCode"
            name="address.zipCode"
            type="text"
            autoComplete="postal-code"
            required
            value={formData.address.zipCode}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
              errors["address.zipCode"] ? "border-red-600" : "border-amber-800"
            }`}
            placeholder="10001"
          />
          {errors["address.zipCode"] && (
            <p className="mt-2 text-sm font-serif text-red-800">
              {errors["address.zipCode"]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="address.country"
            className="block text-base font-serif font-semibold text-amber-950 mb-2"
          >
            Country
          </label>
          <select
            id="address.country"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950"
          >
            <option value="USA">United States</option>
            <option value="CAN">Canada</option>
            <option value="GBR">United Kingdom</option>
            <option value="AUS">Australia</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-100 border-2 border-blue-800 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-blue-800"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-serif text-blue-900">
              Your address is used for location-based searches and item delivery
              coordination. We never share your exact address publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="role"
            className="block text-base font-serif font-semibold text-amber-950 mb-3"
          >
            I want to be a *
          </label>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="role-borrower"
                name="role"
                type="radio"
                value="borrower"
                checked={formData.role === "borrower"}
                onChange={handleChange}
                className="h-5 w-5 border-2 border-amber-800 text-amber-800 focus:ring-amber-800"
              />
              <label htmlFor="role-borrower" className="ml-3">
                <span className="block text-base font-serif font-semibold text-amber-950">
                  Borrower
                </span>
                <span className="block text-sm font-serif text-amber-800">
                  I want to rent items from others
                </span>
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="role-lender"
                name="role"
                type="radio"
                value="lender"
                checked={formData.role === "lender"}
                onChange={handleChange}
                className="h-5 w-5 border-2 border-amber-800 text-amber-800 focus:ring-amber-800"
              />
              <label htmlFor="role-lender" className="ml-3">
                <span className="block text-base font-serif font-semibold text-amber-950">
                  Lender
                </span>
                <span className="block text-sm font-serif text-amber-800">
                  I want to lend my items to others
                </span>
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="role-both"
                name="role"
                type="radio"
                value="both"
                checked={formData.role === "both"}
                onChange={handleChange}
                className="h-5 w-5 border-2 border-amber-800 text-amber-800 focus:ring-amber-800"
              />
              <label htmlFor="role-both" className="ml-3">
                <span className="block text-base font-serif font-semibold text-amber-950">
                  Both
                </span>
                <span className="block text-sm font-serif text-amber-800">
                  I want to rent and lend items
                </span>
              </label>
            </div>
          </div>
          {errors.role && (
            <p className="mt-2 text-sm font-serif text-red-800">
              {errors.role}
            </p>
          )}
        </div>

        <div className="bg-amber-100 border-2 border-amber-800 p-4">
          <h4 className="font-serif font-bold text-amber-950 mb-3">
            Role Benefits
          </h4>
          <ul className="text-sm font-serif text-amber-900 space-y-2">
            {formData.role === "borrower" && (
              <>
                <li>✓ Rent items at affordable prices</li>
                <li>✓ No need to buy expensive items</li>
                <li>✓ Access to verified lenders</li>
              </>
            )}
            {formData.role === "lender" && (
              <>
                <li>✓ Earn money from unused items</li>
                <li>✓ Built-in insurance protection</li>
                <li>✓ Verified borrower system</li>
              </>
            )}
            {formData.role === "both" && (
              <>
                <li>✓ Full platform access</li>
                <li>✓ Earn and save money</li>
                <li>✓ Best of both worlds</li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-base font-serif font-semibold text-amber-950 mb-2"
        >
          Password *
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
              errors.password ? "border-red-600" : "border-amber-800"
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <svg
                className="h-6 w-6 text-amber-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-amber-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm font-serif text-red-800">
            {errors.password}
          </p>
        )}
        <p className="mt-2 text-sm font-serif italic text-amber-800">
          Must be at least 6 characters with uppercase, lowercase, and number
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-base font-serif font-semibold text-amber-950 mb-2"
        >
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950 ${
              errors.confirmPassword ? "border-red-600" : "border-amber-800"
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? (
              <svg
                className="h-6 w-6 text-amber-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-amber-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-2 text-sm font-serif text-red-800">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-5 w-5 border-2 border-amber-800 text-amber-800 focus:ring-amber-800"
        />
        <label
          htmlFor="terms"
          className="ml-3 block text-sm font-serif text-amber-900"
        >
          I agree to the{" "}
          <Link
            to="/terms"
            className="font-serif font-semibold text-amber-800 hover:text-amber-950 underline decoration-dotted"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="font-serif font-semibold text-amber-800 hover:text-amber-950 underline decoration-dotted"
          >
            Privacy Policy
          </Link>
        </label>
      </div>

      <div className="flex items-center">
        <input
          id="communications"
          name="communications"
          type="checkbox"
          className="h-5 w-5 border-2 border-amber-800 text-amber-800 focus:ring-amber-800"
        />
        <label
          htmlFor="communications"
          className="ml-3 block text-sm font-serif text-amber-900"
        >
          I want to receive updates about new features and promotions
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-serif font-bold text-amber-950">
            Create your account
          </h2>
          <p className="mt-4 text-base font-serif text-amber-900">
            Join our community of sharers and renters
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

          {renderStepIndicator()}

          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center bg-amber-100 text-amber-900 font-serif font-bold text-base px-6 py-3 border-2 border-amber-800 hover:bg-amber-200 transition-colors"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center bg-amber-100 text-amber-900 font-serif font-bold text-base px-6 py-3 border-2 border-amber-800 hover:bg-amber-200 transition-colors"
                >
                  Already have an account?
                </Link>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center bg-amber-800 text-amber-50 font-serif font-bold text-base px-6 py-3 border-4 border-amber-950 hover:bg-amber-900 transition-colors shadow-lg"
                >
                  Continue
                  <svg
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center bg-amber-800 text-amber-50 font-serif font-bold text-base px-6 py-3 border-4 border-amber-950 hover:bg-amber-900 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-50"
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              )}
            </div>
          </form>

          {step === 1 && (
            <div className="mt-8 pt-6 border-t-2 border-amber-800">
              <p className="text-center text-sm font-serif text-amber-800">
                By continuing, you agree to our{" "}
                <Link
                  to="/terms"
                  className="font-serif font-semibold text-amber-800 hover:text-amber-950 underline decoration-dotted"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-serif font-semibold text-amber-800 hover:text-amber-950 underline decoration-dotted"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-base font-serif text-amber-900">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-serif font-semibold text-amber-800 hover:text-amber-950 underline decoration-dotted"
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
