"use client";

import { useSession, signIn, signOut } from 'next-auth/react';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/schema/userSchema";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";

// Only pick login fields from userSchema
const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(true);
    setLoginError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
     console.log(res);
     
    setLoading(false);
    
    if (res?.error) {
      setLoginError("Invalid email or password");
    } else {
      router.push("/"); 
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted to-background px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-border">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
              {/* Forgot password link */}
              <div className="text-right text-xs mt-1">
                <Link
                  href="/forget"
                  className="text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Error */}
            {loginError && (
              <p className="text-sm text-red-500 text-center">{loginError}</p>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="h-px flex-1 bg-muted-foreground/30"></span>
              or
              <span className="h-px flex-1 bg-muted-foreground/30"></span>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 hover:bg-muted transition"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </Button>

            {/* Register Link */}
            <div className="text-center text-sm text-muted-foreground mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
