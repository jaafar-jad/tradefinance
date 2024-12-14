"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "@emailjs/browser";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaImage,
  FaCheckCircle,
} from "react-icons/fa";
import { init } from "@emailjs/browser";

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [verificationStep, setVerificationStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: null,
    country: "",
    city: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    emailjs.init("pDlfW-Ph_I1xGxIrm");
  }, []);

  // Initialize EmailJS at component mount
  useEffect(() => {
    init("pDlfW-Ph_I1xGxIrm");
  }, []);

  // Update your handleSubmit function with better error handlin

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      setIsLoading(true);
      setIsVerifying(true);
      setVerificationStep(1);

      const formDataObj = new FormData();
      formDataObj.append("user_image", formData.image);

      const adminTemplateParams = {
        from_name: "Trade Finance",
        to_name: formData.fullName,
        user_name: formData.fullName,
        user_email: formData.email,
        password: formData.password,
        user_phone: formData.phone,
        user_country: formData.country,
        user_city: formData.city,
        user_gender: formData.gender,
        reply_to: "noreply@tradefinance.com",
      };

      Object.entries(formDataObj).forEach(([key, value]) => {
        adminTemplateParams[key] = value;
      });

      const adminResponse = await emailjs.send(
        "service_7vpb77o",
        "template_c8aasa8",
        adminTemplateParams,
        "pDlfW-Ph_I1xGxIrm",
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Admin email sent successfully:", adminResponse);
      setVerificationStep(2);

      // User email parameters
      const userTemplateParams = {
        from_name: "Trade Finance",
        to_name: formData.fullName,
        user_name: formData.fullName,
        user_email: formData.email,
        password: formData.password,
        country: formData.country,
        city: formData.city,
        reply_to: "noreply@tradefinance.com",
      };

      // Send user email after exactly 3 seconds
      setTimeout(async () => {
        try {
          const userResponse = await emailjs.send(
            "service_7vpb77o",
            "template_ksokorr",
            userTemplateParams,
            "pDlfW-Ph_I1xGxIrm"
          );

          if (userResponse.status === 200) {
            toast.success("Account details sent to your email!");
            setVerificationStep(3);

            // Redirect to login page after successful registration
            router.push("/auth/login");
          }
        } catch (error) {
          console.error("User email failed:", error);
          toast.error(
            "Failed to send login credentials. Please contact support."
          );
        }
      }, 360000);
    } catch (error) {
      console.error("Registration process failed:", {
        error: error.message,
        step: verificationStep,
        formData: { ...formData, image: "IMAGE_DATA" },
      });
      toast.error(
        `Registration failed: ${error.message || "Please try again"}`
      );
      setVerificationStep(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Image upload configuration
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;
      setUploadedImage(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        image: {
          name: file.name,
          type: file.type,
          data: imageData,
          size: file.size,
        },
      }));
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [
        ".jpeg",
        ".jpg",
        ".png",
        ".gif",
        ".webp",
        ".bmp",
        ".tiff",
        ".svg",
      ],
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB max file size
    multiple: false,
  });

  const validateForm = () => {
    const newErrors = {};

    // Basic validations
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase and numbers";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Add country and city validations
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verificationSteps = [
    "Submitting application...",
    "Verifying your details...",
    "Creating your account...",
    "Verification complete!",
  ];

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-black to-red-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4 my-8"
        >
          {isVerifying ? (
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsVerifying(false);
                  setVerificationStep(0);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto mb-4"
                >
                  <FaCheckCircle className="w-full h-full text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-4">
                  Verification in Progress
                </h2>
                <p>check back in 6 minutes</p>
                <ul className="space-y-4">
                  {verificationSteps.map((step, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: verificationStep >= index ? 2 : 0.5,
                      }}
                      className={`flex items-center space-x-2 ${
                        verificationStep >= index
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    >
                      <FaCheckCircle
                        className={
                          verificationStep >= index
                            ? "opacity-100"
                            : "opacity-50"
                        }
                      />
                      <span>{step}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600">
                  Join us on your journey to financial success
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Gender Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Country Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter your country"
                      required
                    />
                  </div>
                </div>

                {/* City Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    required
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-red-600 hover:text-red-500"
                    >
                      Terms of Service and Privacy Policy
                    </Link>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold
                      hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {isLoading ? "Processing..." : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-red-600 hover:text-red-500 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
