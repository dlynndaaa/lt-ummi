"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
// import { SocialLoginButton } from "@/components/ui/social-login-button"
// import { AuthDivider } from "@/components/ui/auth-divider"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    phone: "",
    faculty: "",
    study_program: "",
    student_id: "",
    whatsapp: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          faculty: formData.faculty,
          study_program: formData.study_program,
          student_id: formData.student_id,
          whatsapp: formData.whatsapp,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        alert(result.error || "Failed to register")
        return
      }

      alert("Registration successful!")
      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      alert("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Full Name"
        type="text"
        placeholder="Your full name"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        error={errors.name}
        disabled={isLoading}
      />

      <FormField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        error={errors.email}
        disabled={isLoading}
      />

      <FormField
        label="Phone"
        type="text"
        placeholder="Your phone number"
        value={formData.phone}
        onChange={(e) => handleInputChange("phone", e.target.value)}
        disabled={isLoading}
      />

      <FormField
        label="WhatsApp"
        type="text"
        placeholder="WhatsApp number"
        value={formData.whatsapp}
        onChange={(e) => handleInputChange("whatsapp", e.target.value)}
        disabled={isLoading}
      />

      <FormField
        label="Faculty"
        type="text"
        placeholder="Faculty"
        value={formData.faculty}
        onChange={(e) => handleInputChange("faculty", e.target.value)}
        disabled={isLoading}
      />

      <FormField
        label="Study Program"
        type="text"
        placeholder="Study Program"
        value={formData.study_program}
        onChange={(e) => handleInputChange("study_program", e.target.value)}
        disabled={isLoading}
      />

      <FormField
        label="Student ID"
        type="text"
        placeholder="Student ID (NIM)"
        value={formData.student_id}
        onChange={(e) => handleInputChange("student_id", e.target.value)}
        disabled={isLoading}
      />

      <FormField
        label="Password"
        type="password"
        placeholder="Your password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        error={errors.password}
        disabled={isLoading}
      />

      <FormField
        label="Confirm Password"
        type="password"
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
        error={errors.confirmPassword}
        disabled={isLoading}
      />

      <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-2.5" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Register"}
      </Button>
    </form>
  )
}
