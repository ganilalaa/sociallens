"use client"

import { useState } from "react"
import Link from "next/link"
import SimpleInput from "@/components/authentication/SimpleInput"
import SubmitButton from "@/components/authentication/SubmitButton"

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    username: "",
    password: "",
    image: null,
    bio: "",
  })

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const nextSubmit = () => {
    setErrorMessage("")
    const { email, fullname, username, password } = formData

    if (step === 1) {
      if (!email || !fullname || !username || !password) {
        setErrorMessage("All fields are required.")
        return
      }

      // Këtu mund të shtosh kontrollin ndaj backend më vonë
      setStep((prevStep) => prevStep + 1)
    } else {
      setStep((prevStep) => prevStep + 1)
    }
  }

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("Registration successful! (Placeholder)")
    setTimeout(() => {
      // simulate redirect
    }, 2000)
    setIsSubmitting(false)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md max-w-sm w-full text-center">
        <h1
          className="text-5xl mb-5 text-gray-800 font-handwriting font-bold"
          style={{ fontFamily: "'Lucida Handwriting', cursive" }}
        >
          Social Lens
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 flex-col mb-3">
            <p className="text-gray-400 font-bold">
              {step < 4 ? (
                "Sign up to see photos and videos from your friends"
              ) : (
                <span>
                  Welcome to Social Lens{" "}
                  <span className="text-[#1F2937]">{formData.fullname}</span>
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
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname}
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
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    isRequired={true}
                  />
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
  )
}