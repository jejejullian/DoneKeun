"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { registerSchema } from "@/lib/validations/auth";
import z from "zod";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const parsed = registerSchema.safeParse({ name, email, password, confirmPassword });

    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    setLoading(true);

    try {
      await authClient.signUp.email(
        {
          name: parsed.data.name,
          email: parsed.data.email,
          password: parsed.data.password,
          callbackURL: "/todos",
        },
        {
          onSuccess: () => {
            router.push("/todos");
          },
          onError: (ctx) => {
            setError(ctx.error.message);
            setLoading(false);
          },
        },
      );
    } catch (err) {
      console.error("Registration failed:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Buat Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup className="gap-4">
              {/* Username */}
              <Field data-invalid={!!fieldErrors.name}>
                <FieldLabel htmlFor="register-username">Username</FieldLabel>
                <Input id="register-username" type="text" value={name} onChange={(e) => setName(e.target.value)} required autoFocus aria-invalid={!!fieldErrors.name} className="h-10" />
                {fieldErrors.name?.[0] && <FieldError>{fieldErrors.name[0]}</FieldError>}
              </Field>

              {/* Email */}
              <Field data-invalid={!!fieldErrors.email}>
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <Input id="register-email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-invalid={!!fieldErrors.email} className="h-10" />
                {fieldErrors.email?.[0] && <FieldError>{fieldErrors.email[0]}</FieldError>}
              </Field>

              {/* Password */}
              <Field data-invalid={!!fieldErrors.password}>
                <FieldLabel htmlFor="register-password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-invalid={!!fieldErrors.password}
                    className="h-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.password?.[0] && <FieldError>{fieldErrors.password[0]}</FieldError>}
              </Field>

              {/* Confirm Password */}
              <Field data-invalid={!!fieldErrors.confirmPassword}>
                <FieldLabel htmlFor="register-confirm-password">Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    aria-invalid={!!fieldErrors.confirmPassword}
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.confirmPassword?.[0] && <FieldError>{fieldErrors.confirmPassword[0]}</FieldError>}
              </Field>

              {/* Global Error (dari server) */}
              {error && <FieldError>{error}</FieldError>}

              <Button type="submit" disabled={loading} className="w-full h-10 cursor-pointer rounded-2xl">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <span>Signing up...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </FieldGroup>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground pt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}