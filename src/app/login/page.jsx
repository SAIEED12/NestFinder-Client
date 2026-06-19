"use client";

import React, { useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { Home, Eye, EyeOff, LogIn } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    try {
      const { data, error } = await authClient.signIn.email({
        ...user,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Login Failed!");
        setIsLoading(false);
        return;
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      setIsLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const inputClassName =
    "w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E05638] focus:border-transparent transition-all";

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50/40 dark:bg-zinc-950 px-6 py-12 transition-colors duration-200">
      <div className="w-full max-w-md bg-white border border-slate-100 dark:border-zinc-900 dark:bg-zinc-900 rounded-3xl p-8 shadow-xl shadow-slate-100/30 dark:shadow-none">
        {/* Top Header & Logo Identity */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E05638] text-white shadow-sm mb-3">
            <Home size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            Enter your credentials to access your NestFinder profile
          </p>
        </div>

        {/* HeroUI Form Structure */}
        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {/* 1. Email Field */}
          <TextField
            isRequired
            name="email"
            type="email"
            className="w-full flex flex-col gap-1.5"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Email Address
            </Label>
            <Input placeholder="john@example.com" className={inputClassName} />
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* 2. Password Field */}
          <TextField
            isRequired
            name="password"
            type={isVisible ? "text" : "password"}
            className="w-full flex flex-col gap-1.5"
          >
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Password
              </Label>
              <a
                href="#"
                className="text-xs font-medium text-[#E05638] hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative w-full">
              <Input
                placeholder="Enter your password"
                className={inputClassName}
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none"
              >
                {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* Action Operations */}
          <div className="flex flex-col gap-2 mt-4">
            <Button
              type="submit"
              className="w-full rounded-xl bg-[#E05638] text-sm font-semibold text-white shadow-md hover:bg-[#c9492e] transition-all h-11 flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Sign In
            </Button>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-12 font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-3 cursor-pointer"
          >
            <Image
              width={20}
              height={20}
              src="https://www.google.com/favicon.ico"
              alt="Google"
            />
            Sign in with Google
          </button>

          <p className="text-center text-xs text-slate-400 dark:text-zinc-500 mt-4">
            Don&apos;t have an account yet?{" "}
            <a
              href="/register"
              className="text-[#E05638] font-bold hover:underline"
            >
              Sign Up
            </a>
          </p>
        </Form>
      </div>
    </main>
  );
}
