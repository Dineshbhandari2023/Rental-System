// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuth } from "../../context/AuthContext";
// import Message from "../common/Message";
// import {
//   UserIcon,
//   EnvelopeIcon,
//   PhoneIcon,
//   MapPinIcon,
//   LockClosedIcon,
//   CheckCircleIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   ArrowRightIcon,
//   ArrowLeftIcon,
//   ShieldCheckIcon,
// } from "@heroicons/react/24/outline";

// const Register = () => {
//   const [profileImage, setProfileImage] = useState(null);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     role: "borrower",
//     address: {
//       street: "",
//       city: "",
//       state: "",
//       zipCode: "",
//       country: "NPL",
//     },
//   });

//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [step, setStep] = useState(1);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const { register, error: authError, setError } = useAuth();
//   const navigate = useNavigate();

//   const nepalProvinces = [
//     "Province No. 1 (Koshi)",
//     "Madhesh Province",
//     "Bagmati Province",
//     "Gandaki Province",
//     "Lumbini Province",
//     "Karnali Province",
//     "Sudurpashchim Province",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.includes(".")) {
//       const [parent, child] = name.split(".");
//       setFormData((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }

//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateStep1 = () => {
//     const newErrors = {};

//     if (!formData.firstName.trim()) {
//       newErrors.firstName = "First name is required";
//     } else if (formData.firstName.length < 2) {
//       newErrors.firstName = "First name must be at least 2 characters";
//     }

//     if (!formData.lastName.trim()) {
//       newErrors.lastName = "Last name is required";
//     } else if (formData.lastName.length < 2) {
//       newErrors.lastName = "Last name must be at least 2 characters";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (
//       !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ""))
//     ) {
//       newErrors.phone = "Please enter a valid phone number";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateStep2 = () => {
//     const newErrors = {};

//     if (!formData.address.street.trim()) {
//       newErrors["address.street"] = "Street address is required";
//     }

//     if (!formData.address.city.trim()) {
//       newErrors["address.city"] = "City is required";
//     }

//     if (!formData.address.state) {
//       newErrors["address.state"] = "State is required";
//     }

//     if (!formData.address.zipCode.trim()) {
//       newErrors["address.zipCode"] = "ZIP code is required";
//     } else if (!/^\d{5}(-\d{4})?$/.test(formData.address.zipCode)) {
//       newErrors["address.zipCode"] = "Please enter a valid ZIP code";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateStep3 = () => {
//     const newErrors = {};

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password =
//         "Password must contain at least one uppercase letter, one lowercase letter, and one number";
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     if (!formData.role) {
//       newErrors.role = "Please select your role";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (step === 1 && validateStep1()) {
//       setStep(2);
//     } else if (step === 2 && validateStep2()) {
//       setStep(3);
//     }
//   };

//   const prevStep = () => {
//     setStep(step - 1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!validateStep3()) return;

//     setIsLoading(true);

//     const formDataToSend = new FormData();

//     formDataToSend.append("firstName", formData.firstName.trim());
//     formDataToSend.append("lastName", formData.lastName.trim());
//     formDataToSend.append("email", formData.email.trim());
//     formDataToSend.append("phone", formData.phone.trim());
//     formDataToSend.append("password", formData.password);
//     formDataToSend.append("role", formData.role);

//     formDataToSend.append(
//       "address",
//       JSON.stringify({
//         street: formData.address.street.trim(),
//         city: formData.address.city.trim(),
//         state: formData.address.state,
//         zipCode: formData.address.zipCode.trim(),
//         country: formData.address.country,
//       })
//     );

//     if (profileImage) {
//       formDataToSend.append("profileImage", profileImage);
//     }

//     const result = await register(formDataToSend);

//     setIsLoading(false);

//     if (result.success) {
//       navigate("/dashboard");
//     }
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//       },
//     },
//   };

//   const renderStepIndicator = () => (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="mb-10"
//     >
//       <div className="flex items-center justify-center">
//         {[1, 2, 3].map((stepNumber) => (
//           <React.Fragment key={stepNumber}>
//             <motion.div
//               variants={itemVariants}
//               whileHover={{ scale: 1.05 }}
//               className={`relative flex items-center justify-center w-14 h-14 border-2 font-serif font-bold text-lg transition-all duration-300 ${
//                 step >= stepNumber
//                   ? "bg-gradient-to-br from-amber-600 to-amber-700 text-amber-50 border-amber-500 shadow-lg shadow-amber-900/50"
//                   : "bg-slate-800 text-amber-400/50 border-amber-800/30"
//               }`}
//             >
//               {step > stepNumber ? (
//                 <CheckCircleIcon className="w-7 h-7" />
//               ) : (
//                 stepNumber
//               )}
//               {step >= stepNumber && (
//                 <>
//                   <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400/50" />
//                   <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400/50" />
//                 </>
//               )}
//             </motion.div>
//             {stepNumber < 3 && (
//               <motion.div
//                 initial={{ scaleX: 0 }}
//                 animate={{ scaleX: step > stepNumber ? 1 : 0.3 }}
//                 transition={{ duration: 0.5 }}
//                 className={`w-24 h-1 mx-2 origin-left ${
//                   step > stepNumber
//                     ? "bg-gradient-to-r from-amber-600 to-amber-700"
//                     : "bg-amber-900/30"
//                 }`}
//               />
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//       <div className="flex justify-between mt-6 text-sm font-serif px-4">
//         {["Personal Info", "Address", "Security"].map((label, index) => (
//           <motion.span
//             key={label}
//             variants={itemVariants}
//             className={`transition-all duration-300 ${
//               step >= index + 1
//                 ? "text-amber-300 font-bold"
//                 : "text-amber-600/50"
//             }`}
//           >
//             {label}
//           </motion.span>
//         ))}
//       </div>
//     </motion.div>
//   );

//   const InputField = ({
//     label,
//     id,
//     name,
//     type = "text",
//     icon: Icon,
//     error,
//     helpText,
//     ...props
//   }) => (
//     <motion.div variants={itemVariants}>
//       <label
//         htmlFor={id}
//         className="block text-sm font-serif font-semibold text-amber-200 mb-2"
//       >
//         {label}
//       </label>
//       <div className="relative">
//         {Icon && (
//           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//             <Icon className="h-5 w-5 text-amber-600" />
//           </div>
//         )}
//         <input
//           id={id}
//           name={name}
//           type={type}
//           className={`w-full ${
//             Icon ? "pl-12" : "pl-4"
//           } pr-4 py-3 bg-slate-800/50 border-2 font-serif text-amber-100 placeholder-amber-700/50 focus:outline-none focus:border-amber-600 focus:bg-slate-800 transition-all duration-300 ${
//             error ? "border-red-500/50" : "border-amber-900/30"
//           }`}
//           {...props}
//         />
//       </div>
//       {error && (
//         <motion.p
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mt-2 text-sm font-serif text-red-400 flex items-center gap-1"
//         >
//           <span className="text-red-500">⚠</span> {error}
//         </motion.p>
//       )}
//       {helpText && !error && (
//         <p className="mt-2 text-xs font-serif italic text-amber-600/70">
//           {helpText}
//         </p>
//       )}
//     </motion.div>
//   );

//   const renderStep1 = () => (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="space-y-6"
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <InputField
//           label="First Name *"
//           id="firstName"
//           name="firstName"
//           icon={UserIcon}
//           value={formData.firstName}
//           onChange={handleChange}
//           error={errors.firstName}
//           placeholder="John"
//           autoComplete="given-name"
//         />
//         <InputField
//           label="Last Name *"
//           id="lastName"
//           name="lastName"
//           icon={UserIcon}
//           value={formData.lastName}
//           onChange={handleChange}
//           error={errors.lastName}
//           placeholder="Doe"
//           autoComplete="family-name"
//         />
//       </div>

//       <InputField
//         label="Email Address *"
//         id="email"
//         name="email"
//         type="email"
//         icon={EnvelopeIcon}
//         value={formData.email}
//         onChange={handleChange}
//         error={errors.email}
//         placeholder="you@example.com"
//         autoComplete="email"
//       />

//       <InputField
//         label="Phone Number *"
//         id="phone"
//         name="phone"
//         type="tel"
//         icon={PhoneIcon}
//         value={formData.phone}
//         onChange={handleChange}
//         error={errors.phone}
//         placeholder="+977 123-4567"
//         helpText="We'll use this for important notifications"
//         autoComplete="tel"
//       />

//       <motion.div variants={itemVariants}>
//         <label
//           htmlFor="profileImage"
//           className="block text-sm font-serif font-semibold text-amber-200 mb-2"
//         >
//           Profile Image
//         </label>
//         <div className="relative border-2 border-dashed border-amber-900/30 bg-slate-800/30 p-6 hover:border-amber-700/50 transition-all duration-300">
//           <input
//             id="profileImage"
//             name="profileImage"
//             type="file"
//             accept="image/*"
//             onChange={(e) => setProfileImage(e.target.files[0])}
//             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//           />
//           <div className="text-center">
//             <UserIcon className="mx-auto h-12 w-12 text-amber-600/50" />
//             <p className="mt-2 text-sm font-serif text-amber-300">
//               {profileImage ? profileImage.name : "Click to upload"}
//             </p>
//             <p className="mt-1 text-xs font-serif text-amber-600/70">
//               JPG, PNG or WEBP. Max 2MB.
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );

//   const renderStep2 = () => (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="space-y-6"
//     >
//       <InputField
//         label="Street Address *"
//         id="address.street"
//         name="address.street"
//         icon={MapPinIcon}
//         value={formData.address.street}
//         onChange={handleChange}
//         error={errors["address.street"]}
//         placeholder="Itahari, Halgada"
//         autoComplete="street-address"
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <InputField
//           label="City *"
//           id="address.city"
//           name="address.city"
//           value={formData.address.city}
//           onChange={handleChange}
//           error={errors["address.city"]}
//           placeholder="Itahari/Kathmandu"
//           autoComplete="address-level2"
//         />

//         <motion.div variants={itemVariants}>
//           <label
//             htmlFor="address.state"
//             className="block text-sm font-serif font-semibold text-amber-200 mb-2"
//           >
//             Province *
//           </label>
//           <select
//             id="address.state"
//             name="address.state"
//             value={formData.address.state}
//             onChange={handleChange}
//             className={`w-full px-4 py-3 bg-slate-800/50 border-2 font-serif text-amber-100 focus:outline-none focus:border-amber-600 focus:bg-slate-800 transition-all duration-300 ${
//               errors["address.state"]
//                 ? "border-red-500/50"
//                 : "border-amber-900/30"
//             }`}
//           >
//             <option value="">Select province</option>
//             {nepalProvinces.map((province) => (
//               <option key={province} value={province}>
//                 {province}
//               </option>
//             ))}
//           </select>
//           {errors["address.state"] && (
//             <motion.p
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mt-2 text-sm font-serif text-red-400"
//             >
//               {errors["address.state"]}
//             </motion.p>
//           )}
//         </motion.div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <InputField
//           label="ZIP Code *"
//           id="address.zipCode"
//           name="address.zipCode"
//           value={formData.address.zipCode}
//           onChange={handleChange}
//           error={errors["address.zipCode"]}
//           placeholder="10001"
//           autoComplete="postal-code"
//         />

//         <motion.div variants={itemVariants}>
//           <label
//             htmlFor="address.country"
//             className="block text-sm font-serif font-semibold text-amber-200 mb-2"
//           >
//             Country *
//           </label>
//           <select
//             id="address.country"
//             name="address.country"
//             value={formData.address.country}
//             onChange={handleChange}
//             className="w-full px-4 py-3 bg-slate-800/50 border-2 border-amber-900/30 font-serif text-amber-100 focus:outline-none focus:border-amber-600 focus:bg-slate-800 transition-all duration-300"
//           >
//             <option value="NPL">Nepal</option>
//             <option value="IND">India</option>
//             <option value="USA">United States</option>
//             <option value="CAN">Canada</option>
//             <option value="GBR">United Kingdom</option>
//             <option value="AUS">Australia</option>
//             <option value="OTHER">Other</option>
//           </select>
//         </motion.div>
//       </div>

//       <motion.div
//         variants={itemVariants}
//         className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-2 border-blue-700/30 p-4"
//       >
//         <div className="flex gap-3">
//           <ShieldCheckIcon className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
//           <div>
//             <p className="text-sm font-serif text-blue-200 leading-relaxed">
//               Your address is used for location-based searches and item delivery
//               coordination. We never share your exact address publicly.
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );

//   const renderStep3 = () => (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="space-y-6"
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <motion.div variants={itemVariants}>
//           <label className="block text-sm font-serif font-semibold text-amber-200 mb-4">
//             I want to be a *
//           </label>
//           <div className="space-y-3">
//             {[
//               {
//                 value: "borrower",
//                 label: "Borrower",
//                 desc: "I want to rent items from others",
//               },
//               {
//                 value: "lender",
//                 label: "Lender",
//                 desc: "I want to lend my items to others",
//               },
//               {
//                 value: "both",
//                 label: "Both",
//                 desc: "I want to rent and lend items",
//               },
//             ].map((role) => (
//               <label
//                 key={role.value}
//                 className={`flex items-start p-4 border-2 cursor-pointer transition-all duration-300 ${
//                   formData.role === role.value
//                     ? "bg-gradient-to-r from-amber-900/30 to-amber-800/20 border-amber-600"
//                     : "bg-slate-800/30 border-amber-900/20 hover:border-amber-800/40"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="role"
//                   value={role.value}
//                   checked={formData.role === role.value}
//                   onChange={handleChange}
//                   className="mt-1 h-5 w-5 border-2 border-amber-700 text-amber-600 focus:ring-amber-600"
//                 />
//                 <div className="ml-3">
//                   <span className="block text-base font-serif font-semibold text-amber-200">
//                     {role.label}
//                   </span>
//                   <span className="block text-sm font-serif text-amber-400/70 mt-1">
//                     {role.desc}
//                   </span>
//                 </div>
//               </label>
//             ))}
//           </div>
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border-2 border-amber-800/30 p-6 h-fit"
//         >
//           <h4 className="font-serif font-bold text-amber-200 mb-4 flex items-center gap-2">
//             <CheckCircleIcon className="w-5 h-5 text-amber-500" />
//             Role Benefits
//           </h4>
//           <ul className="text-sm font-serif text-amber-300/80 space-y-3">
//             {formData.role === "borrower" && (
//               <>
//                 <li className="flex items-start gap-2">
//                   <span className="text-amber-500">✓</span> Rent items at
//                   affordable prices
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-amber-500">✓</span> No need to buy
//                   expensive items
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-amber-500">✓</span> Access to verified
//                   lenders
//                 </li>
//               </>
//             )}
//             {formData.role === "lender" && (
//               <>
//                 <li className="flex items-start gap-2">
//                   <span className="text-amber-500">✓</span> Earn money from
//                   unused items
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-amber-500">✓</span> Built-in insurance
//                   protection
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-amber-500">✓</span> Verified borrower
//                   system
//                 </li>
//               </>
//             )}
//             {formData.role === "both" && (
//               <>
//                 <li className="flex items-start gap-2">
//                   <span className="text-amber-500">✓</span> Full platform access
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-amber-500">✓</span> Earn and save money
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-amber-500">✓</span> Best of both worlds
//                 </li>
//               </>
//             )}
//           </ul>
//         </motion.div>
//       </div>

//       <motion.div variants={itemVariants}>
//         <label
//           htmlFor="password"
//           className="block text-sm font-serif font-semibold text-amber-200 mb-2"
//         >
//           Password *
//         </label>
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//             <LockClosedIcon className="h-5 w-5 text-amber-600" />
//           </div>
//           <input
//             id="password"
//             name="password"
//             type={showPassword ? "text" : "password"}
//             value={formData.password}
//             onChange={handleChange}
//             className={`w-full pl-12 pr-12 py-3 bg-slate-800/50 border-2 font-serif text-amber-100 placeholder-amber-700/50 focus:outline-none focus:border-amber-600 focus:bg-slate-800 transition-all duration-300 ${
//               errors.password ? "border-red-500/50" : "border-amber-900/30"
//             }`}
//             placeholder="••••••••"
//             autoComplete="new-password"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute inset-y-0 right-0 pr-4 flex items-center text-amber-600 hover:text-amber-500 transition-colors"
//           >
//             {showPassword ? (
//               <EyeSlashIcon className="h-5 w-5" />
//             ) : (
//               <EyeIcon className="h-5 w-5" />
//             )}
//           </button>
//         </div>
//         {errors.password && (
//           <motion.p
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mt-2 text-sm font-serif text-red-400"
//           >
//             {errors.password}
//           </motion.p>
//         )}
//         {!errors.password && (
//           <p className="mt-2 text-xs font-serif italic text-amber-600/70">
//             Must be at least 6 characters with uppercase, lowercase, and number
//           </p>
//         )}
//       </motion.div>

//       <motion.div variants={itemVariants}>
//         <label
//           htmlFor="confirmPassword"
//           className="block text-sm font-serif font-semibold text-amber-200 mb-2"
//         >
//           Confirm Password *
//         </label>
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//             <LockClosedIcon className="h-5 w-5 text-amber-600" />
//           </div>
//           <input
//             id="confirmPassword"
//             name="confirmPassword"
//             type={showConfirmPassword ? "text" : "password"}
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             className={`w-full pl-12 pr-12 py-3 bg-slate-800/50 border-2 font-serif text-amber-100 placeholder-amber-700/50 focus:outline-none focus:border-amber-600 focus:bg-slate-800 transition-all duration-300 ${
//               errors.confirmPassword
//                 ? "border-red-500/50"
//                 : "border-amber-900/30"
//             }`}
//             placeholder="••••••••"
//             autoComplete="new-password"
//           />
//           <button
//             type="button"
//             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//             className="absolute inset-y-0 right-0 pr-4 flex items-center text-amber-600 hover:text-amber-500 transition-colors"
//           >
//             {showConfirmPassword ? (
//               <EyeSlashIcon className="h-5 w-5" />
//             ) : (
//               <EyeIcon className="h-5 w-5" />
//             )}
//           </button>
//         </div>
//         {errors.confirmPassword && (
//           <motion.p
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mt-2 text-sm font-serif text-red-400"
//           >
//             {errors.confirmPassword}
//           </motion.p>
//         )}
//       </motion.div>

//       <motion.div variants={itemVariants} className="space-y-4 pt-4">
//         <label className="flex items-start gap-3 cursor-pointer group">
//           <input
//             id="terms"
//             name="terms"
//             type="checkbox"
//             required
//             className="mt-1 h-5 w-5 border-2 border-amber-700 text-amber-600 focus:ring-amber-600"
//           />
//           <span className="text-sm font-serif text-amber-300/90 group-hover:text-amber-200 transition-colors">
//             I agree to the{" "}
//             <Link
//               to="/terms"
//               className="font-semibold text-amber-400 hover:text-amber-300 underline decoration-dotted"
//             >
//               Terms of Service
//             </Link>{" "}
//             and{" "}
//             <Link
//               to="/privacy"
//               className="font-semibold text-amber-400 hover:text-amber-300 underline decoration-dotted"
//             >
//               Privacy Policy
//             </Link>
//           </span>
//         </label>

//         <label className="flex items-start gap-3 cursor-pointer group">
//           <input
//             id="communications"
//             name="communications"
//             type="checkbox"
//             className="mt-1 h-5 w-5 border-2 border-amber-700 text-amber-600 focus:ring-amber-600"
//           />
//           <span className="text-sm font-serif text-amber-300/90 group-hover:text-amber-200 transition-colors">
//             I want to receive updates about new features and promotions
//           </span>
//         </label>
//       </motion.div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
//       {/* Background decorative elements */}
//       <div className="absolute inset-0 opacity-5">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `radial-gradient(circle at 2px 2px, rgb(217, 119, 6) 1px, transparent 0)`,
//             backgroundSize: "40px 40px",
//           }}
//         />
//       </div>

//       {/* Floating decorative shapes */}
//       <motion.div
//         className="absolute top-20 left-10 w-24 h-24 border-2 border-amber-700/20"
//         animate={{ y: [0, -20, 0], rotate: [0, 90, 0] }}
//         transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
//       />
//       <motion.div
//         className="absolute bottom-20 right-20 w-32 h-32 border-2 border-amber-700/20 rounded-full"
//         animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
//         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//       />

//       <div className="max-w-3xl w-full space-y-8 relative z-10">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center"
//         >
//           <h2 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 mb-4">
//             Create Your Account
//           </h2>
//           <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-4" />
//           <p className="text-lg font-serif text-amber-300/80 italic">
//             Join our community of sharers and renters
//           </p>
//         </motion.div>

//         {/* Main Form Card */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-900/30 shadow-2xl p-8 md:p-10"
//         >
//           {/* Decorative corners */}
//           <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-amber-700/30" />
//           <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-amber-700/30" />

//           {authError && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-6"
//             >
//               <Message
//                 type="error"
//                 message={authError}
//                 onClose={() => setError(null)}
//               />
//             </motion.div>
//           )}

//           {renderStepIndicator()}

//           <form onSubmit={handleSubmit}>
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={step}
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {step === 1 && renderStep1()}
//                 {step === 2 && renderStep2()}
//                 {step === 3 && renderStep3()}
//               </motion.div>
//             </AnimatePresence>

//             {/* Navigation Buttons */}
//             <div className="flex justify-between items-center mt-10 pt-6 border-t-2 border-amber-900/20">
//               {step > 1 ? (
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="button"
//                   onClick={prevStep}
//                   className="inline-flex items-center bg-slate-700/50 text-amber-300 font-serif font-bold text-base px-6 py-3 border-2 border-amber-800/50 hover:bg-slate-700 hover:border-amber-700 transition-all"
//                 >
//                   <ArrowLeftIcon className="h-5 w-5 mr-2" />
//                   Back
//                 </motion.button>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="inline-flex items-center text-amber-400 hover:text-amber-300 font-serif text-sm transition-colors underline decoration-dotted"
//                 >
//                   Already have an account?
//                 </Link>
//               )}

//               {step < 3 ? (
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="button"
//                   onClick={nextStep}
//                   className="inline-flex items-center bg-gradient-to-r from-amber-600 to-amber-700 text-white font-serif font-bold text-base px-8 py-3 border-2 border-amber-500 hover:border-amber-400 transition-all shadow-lg shadow-amber-900/50 hover:shadow-amber-700/50"
//                 >
//                   Continue
//                   <ArrowRightIcon className="h-5 w-5 ml-2" />
//                 </motion.button>
//               ) : (
//                 <motion.button
//                   whileHover={{ scale: isLoading ? 1 : 1.02 }}
//                   whileTap={{ scale: isLoading ? 1 : 0.98 }}
//                   type="submit"
//                   disabled={isLoading}
//                   className="inline-flex items-center bg-gradient-to-r from-amber-600 to-amber-700 text-white font-serif font-bold text-base px-8 py-3 border-2 border-amber-500 hover:border-amber-400 transition-all shadow-lg shadow-amber-900/50 hover:shadow-amber-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <>
//                       <svg
//                         className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       Creating Account...
//                     </>
//                   ) : (
//                     <>
//                       Create Account
//                       <CheckCircleIcon className="h-5 w-5 ml-2" />
//                     </>
//                   )}
//                 </motion.button>
//               )}
//             </div>
//           </form>
//         </motion.div>

//         {/* Footer */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="text-center"
//         >
//           <p className="text-base font-serif text-amber-400/70">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className="font-semibold text-amber-400 hover:text-amber-300 underline decoration-dotted transition-colors"
//             >
//               Sign in here
//             </Link>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Register;

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
      country: "NPL",
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
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (formData.firstName.trim() && formData.firstName.length < 2)
      newErrors.firstName = "At least 2 characters";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
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
      newErrors["address.zipCode"] = "Postal code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "At least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.role) newErrors.role = "Please select a role";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    let valid = false;
    if (step === 1) valid = validateStep1();
    if (step === 2) valid = validateStep2();
    if (step === 3) valid = validateStep3();

    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateStep3()) return;

    setIsLoading(true);

    try {
      // const result = await register(formDataToSend);
      // if (result.success) navigate("/dashboard");
      console.log("Form would be submitted here", formData);
      // navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  //    PROGRESS INDICATOR
  // ────────────────────────────────────────────────
  const StepProgress = () => (
    <div className="mb-10">
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg font-semibold transition-colors ${
                step >= num
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-700 bg-gray-800 text-gray-400"
              }`}
            >
              {step > num ? <CheckCircleIcon className="h-6 w-6" /> : num}
            </div>
            {num < 3 && (
              <div
                className={`h-0.5 w-20 ${
                  step > num ? "bg-indigo-600" : "bg-gray-700"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-4 flex justify-between text-sm font-medium text-gray-400">
        {["Personal Info", "Address", "Account"].map((label, i) => (
          <span key={label} className={step >= i + 1 ? "text-indigo-400" : ""}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );

  // ────────────────────────────────────────────────
  //    INPUT COMPONENT
  // ────────────────────────────────────────────────
  const InputField = ({
    label,
    id,
    name,
    type = "text",
    icon: Icon,
    error,
    helpText,
    ...props
  }) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={props.value ?? ""}
          onChange={props.onChange}
          className={`block w-full rounded-lg border bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none ${
            Icon ? "pl-11" : "pl-4"
          } ${
            error
              ? "border-red-600 focus:border-red-500 focus:ring-red-500/30"
              : "border-gray-700"
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="mt-3 text-lg text-gray-400">
            Join our community and start sharing or borrowing today
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 shadow-2xl backdrop-blur-sm">
          {authError && (
            <div className="border-b border-gray-800 px-8 py-5">
              <Message
                type="error"
                message={authError}
                onClose={() => setError(null)}
              />
            </div>
          )}

          <div className="p-8 lg:p-10">
            <StepProgress />

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <InputField
                      label="First Name *"
                      id="firstName"
                      name="firstName"
                      icon={UserIcon}
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                      placeholder="John"
                      autoComplete="given-name"
                    />
                    <InputField
                      label="Last Name *"
                      id="lastName"
                      name="lastName"
                      icon={UserIcon}
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                      placeholder="Doe"
                    />
                  </div>

                  <InputField
                    label="Email Address *"
                    id="email"
                    name="email"
                    type="email"
                    icon={EnvelopeIcon}
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="you@example.com"
                  />

                  <InputField
                    label="Phone Number *"
                    id="phone"
                    name="phone"
                    type="tel"
                    icon={PhoneIcon}
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="+977 98XXXXXXXX"
                    helpText="Used for verification and important updates"
                  />

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-300">
                      Profile Photo (optional)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-700 bg-gray-800">
                        {profileImage ? (
                          <img
                            src={URL.createObjectURL(profileImage)}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-600">
                            <UserIcon className="h-10 w-10" />
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 hover:border-indigo-600 hover:text-indigo-300 transition-colors">
                        Choose file
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            setProfileImage(e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">JPG, PNG • Max 2 MB</p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Add your step 2 fields here - street, city, province, zip, country */}
                  {/* Example: */}
                  <InputField
                    label="Street Address *"
                    id="address.street"
                    name="address.street"
                    icon={MapPinIcon}
                    value={formData.address.street}
                    onChange={handleChange}
                    error={errors["address.street"]}
                    placeholder="Ward No. 5, Main Road"
                  />
                  {/* ... other address fields ... */}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  {/* Add your step 3 fields here - role, password, confirm password, checkboxes */}
                  {/* Example: */}
                  <InputField
                    label="Password *"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    icon={LockClosedIcon}
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="••••••••"
                  />
                  {/* ... confirm password, role selection, terms checkbox ... */}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-7 py-3 font-medium text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    ← Already have an account?
                  </Link>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-500 transition-colors"
                  >
                    Continue
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating..." : "Create Account"}
                    {!isLoading && <CheckCircleIcon className="h-5 w-5" />}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
