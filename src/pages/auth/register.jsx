"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";
import SimpleInput from "@/components/authentication/SimpleInput";
import SubmitButton from "@/components/authentication/SubmitButton";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    username: "",
    password: "",
    image: null,
    bio: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const nextSubmit = () => {
    setErrorMessage("");
    const { email, name, username, password } = formData;

    if (step === 1) {
      if (!email || !name || !username || !password) {
        setErrorMessage("All fields are required.");
        return;
      }

      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        return;
      }

      setStep((prevStep) => prevStep + 1);
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccessMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md max-w-sm w-full text-center">
        <h1
          className="text-5xl mb-1 text-gray-800 font-handwriting font-bold"
          style={{ fontFamily: "'Lucida Handwriting', cursive" }}
        >
          Social Lens
        </h1>
        <p className="text-sm text-gray-500 mb-4">Connect. Share. Discover.</p>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 flex-col mb-3">
            <p className="text-gray-400 font-bold">
              {step < 4 ? (
                "Sign up to see photos and videos from your friends"
              ) : (
                <span>
                  Welcome to Social Lens{" "}
                  <span className="text-[#1F2937]">{formData.name}</span>
                </span>
              )}
            </p>
            <div className="flex gap-4 flex-col">
              {step === 1 && (
                <>
                  <SimpleInput
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    isRequired={true}
                  />
                  <SimpleInput
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    isRequired={true}
                  />
                  <SimpleInput
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    isRequired={true}
                  />
                  <SimpleInput
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    isRequired={true}
                  />
                  <label className="text-xs text-gray-600 flex items-center gap-2 ml-1">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    Show password
                  </label>
                  <SubmitButton onClick={nextSubmit}>Next</SubmitButton>
                </>
              )}
              {step === 2 && (
                <>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="mb-4 border rounded p-2"
                  />
                  <SubmitButton onClick={nextSubmit}>Next</SubmitButton>
                </>
              )}
              {step === 3 && (
                <>
                  <SimpleInput
                    type="text"
                    name="bio"
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={handleChange}
                    isRequired={false}
                  />
                  <SubmitButton onClick={nextSubmit}>Next</SubmitButton>
                </>
              )}
              {step === 4 && (
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Complete Sign-up"}
                </button>
              )}
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 mb-3 text-sm">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 mb-3 text-sm">{successMessage}</p>
          )}

          <p className="text-gray-400 mb-3 text-sm">
            By signing up, you agree to our{" "}
            <strong>Terms & Privacy Policy.</strong>
          </p>
          <p className="text-gray-700">
            <strong>Have an account? </strong>
            <Link href="/auth/login" className="text-blue-500">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}